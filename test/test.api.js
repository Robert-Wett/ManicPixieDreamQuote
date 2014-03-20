var should   = require('chai').should()
,   client   = require('fakeredis').createClient()
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


describe('Redis Functions', function() {
    var users = {
        bob  = 'user:bob',
        ryan = 'user:ryan',
        mike = 'user:mike'
    }

    beforeEach(function(done) {
        client.sadd('users', users);
    });

    it('does\'nt allow multiple votes', function(done) {

    });

    it('increases the vote count by 1', function(done) {

    });

    it('decreases the vote count by 1', function(done) {

    });

    it('doesn\'t decrease the vote count to negatives', function(done) {

    });
});