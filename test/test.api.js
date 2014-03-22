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

    it('add 1 to up table and 1 to hash vote count', function(done) {
        // Import redisFunction CRUD ops
        
    });

    it('add 1 to down table and -1 to hash vote count', function(done) {
        // Import redisFunction CRUD ops
        
    });


    it('does\'nt allow multiple votes', function(done) {
        // Add 1 to the voted count
        client.sadd('quote:voted:1', users.bob, new Date.now());
        // Get the current length/num of the quotes voted list
        var currentCount = client.scard('quote:voted:1');
        // Add another.. are we just testing set behavior????
        //... GOTO LINE 34
        client.sadd('quote:voted:1', users.bob, new Date.now());
        var newCount = client.sget('quote:voted:1');
        expect(currentCount).to.equal(newCount);
    });

    it('increases the vote count by 1', function(done) {
        var currentCount = client.scard('quote:voted:1');
        client.sadd('quote:voted:1', 'user:jackfantastic', new Date.now());
        expect(currentCount).to.equal(currentCount + 1);
    });

    it('decreases the vote count by 1', function(done) {
        var currentCount = client.scard('quote:voted:1');
        client.sadd('quote:voted:1', 'user:jackfantastic', new Date.now());
        expect(currentCount).to.equal(currentCount + 1);
    });

    it('doesn\'t decrease the vote count to negatives', function(done) {

    });
});