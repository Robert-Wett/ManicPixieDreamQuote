// TESTING
var should    = require('chai').should()
,   supertest = require('supertest')
,   api       = supertest('http://localhost:5000');
    

describe('/api/quote', function() {

    it('returns a quote object as JSON', function(done) {
        api.get('/api/quote')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            if (err) return done(err);
            // OK - add a parent container for JSON returns.
            // There shouldn't ever be just a one-off object, it needs
            // to be wrapped in a parent (much like data.)
            res.body.should.have.property('quotes').and.be.instanceof(Array);
        });
    });
});