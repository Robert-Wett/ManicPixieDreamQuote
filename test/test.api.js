var should   = require('chai').should()
//,   assert   = require('assert')
,   request  = require('supertest')
,   api      = request('http://localhost:5000');
    

describe('/api/quote', function() {

    it('returns a quote object as JSON', function(done) {
        api.get('/api/quote')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            if (err) return done(err);
            res.body[0].should.have.property('id');
            res.body[0].should.have.property('body');
            done();
        });
    });
});