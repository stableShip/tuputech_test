var request = require('request');
var Promise = require('bluebird');
request = Promise.promisifyAll(request);
var co = require('co');
var configs = require('./configs');
var util = require('util');
var retry = require('co-retry');
var fs = require('fs');
fs = Promise.promisifyAll(fs);

class Tuputech {

    /**
     * 获取任务列表
     */
    static getTaskListAsync() {
        return co(function* () {
            var seed = configs.seed;
            var taskListUrl = configs.taskListUrl;
            var requestUrl = taskListUrl + seed;
            var res = yield request.getAsync(requestUrl);
            var data = JSON.parse(res.body);
            return data;
        })
    }

    /**
     * 获取任务结果
     */
    static getTaskResultAsync(taskType) {
        var self = this;
        return retry(function* () {
            var resultsData = yield fs.readFileAsync('./results.json', "utf8");
            var results = resultsData && JSON.parse(resultsData) || {};
            self.results = self.results || results;
            if (self.results[taskType]) {
                var msg = util.format("该类型任务结果已缓存, 任务类型: %s, 任务结果: %s", taskType, self.results[taskType]);
                console.log(msg);
                return self.results[taskType];
            }
            var taskResultUrl = configs.taskResultUrl;
            var requestUrl = taskResultUrl + taskType + "";
            var res = yield request.postAsync(requestUrl);
            self.results[taskType] = res.body + "";
            return res.body + "";
        })
    }

    /**
     * 递归获取任务树结果
     */
    static getTreeResult(taskTree) {
        return co(function* () {
            var results = {};
            results.result = yield Tuputech.getTaskResultAsync(taskTree.type);
            results.child = [];
            for (var childTask in taskTree.child) {
                var childResult = yield Tuputech.getTreeResult(taskTree.child[childTask]);
                results.child.push(childResult);
            }
            return results;
        })
    }

    /**
     * 提交问题答案
     */
    static commitResult(treeId, treeResult) {
        var self = this;
        return retry(function* () {
            if (self.results) {
                yield fs.writeFileAsync('results.json', JSON.stringify(self.results));
            }
            var resultCommitUrl = configs.resultCommitUrl;
            request.debug = true;
            var res = yield request.postAsync({
                url: resultCommitUrl,
                body: {
                    treeId: treeId,
                    result: treeResult,
                    seed: configs.seed
                },
                json: true
            });
            var commitResult = res.body;
            return commitResult;
        })
    }
}


co(function* () {
    try {
        var taskTree = yield Tuputech.getTaskListAsync();
        //递归,检测到有child存在,不断递归,获取任务结果
        var treeId = taskTree.treeId;
        var taskTree = taskTree.tree;
        var treeResult = yield Tuputech.getTreeResult(taskTree);
        var commitResult = yield Tuputech.commitResult(treeId, treeResult);
        console.log(commitResult);
        //成功结果
        //         { success: true,
        //   fruit: '57e63ffe86b5987977927fdd',
        //   score: '100.00',
        //   rank: 26,
        //   msg: 'Congratulations! Please paste this fruit and your codes into the paticular textareas in our website (http://hr.tuputech.com), we will contact you in a few days.' }
    } catch (err) {
        console.log(err)
    }
})