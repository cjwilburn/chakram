var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Methods", function() {
    
    var testWriteMethods = function (testMethod, testUrl) {
        it("should support JSON requests", function () {
            var json = {"num": 2,"str": "test"};
            var response = testMethod(testUrl, json);
            return response.then(function(resp) {
                expect(resp.body).to.be.an('object');
                expect(resp.body.json).to.deep.equal(json);
                expect(resp.body.headers['Content-Type']).to.be.equal('application/json');
            });
        });

        it("should support non-JSON requests", function () {
            var stringPost = "testing with a string post";
            var response = testMethod(testUrl, stringPost, {json:false});
            return response.then(function(resp) {
                expect(resp.body).to.be.a('string');
                expect(JSON.parse(resp.body).data).to.be.equal(stringPost);
                expect(JSON.parse(resp.body).headers['Content-Type']).not.to.be.equal('application/json');
            });
        });
        
        it("should support sending custom headers", function () {
            var customHeaders = {
                "Token": "dummy token value"
            };
            var response = testMethod(testUrl, {}, {
                headers: customHeaders
            });
            return expect(response).to.include.json('headers', customHeaders);
        });
    };
    
    describe("POST", function () {
        testWriteMethods(chakram.post, "http://httpbin.org/post");
    });
    
    describe("PUT", function () {
        testWriteMethods(chakram.put, "http://httpbin.org/put");
    });
    
    describe("DELETE", function () {
        testWriteMethods(chakram.delete, "http://httpbin.org/delete");
    });
    
    describe("PATCH", function () {
        testWriteMethods(chakram.patch, "http://httpbin.org/patch");
    });    
    
    it("should allow GET requests", function () {
        return chakram.get("http://httpbin.org/get?test=str")
        .then(function(obj) {
            expect(obj.body).to.be.an('object');
            expect(obj.body.args.test).to.equal('str');
        });
    });
    
    it("should allow HEAD requests", function () {
        var request = chakram.head("http://httpbin.org/get?test=str");
        expect(request).to.have.status(200);
        expect(request).to.have.header('content-length');
        return chakram.wait().then(function(obj) {
            expect(obj.body).to.be.undefined;
        });
    });
    
    it("should allow OPTIONS requests", function () {
        var request = chakram.options("http://httpbin.org/get?test=str");
        expect(request).to.have.header('Access-Control-Allow-Credentials');
        expect(request).to.have.header('Access-Control-Allow-Methods');
        expect(request).to.have.header('Access-Control-Allow-Origin');
        expect(request).to.have.header('Access-Control-Max-Age');
        return chakram.wait();
    });
});