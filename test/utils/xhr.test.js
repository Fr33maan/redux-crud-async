var sinon        = require('sinon')
var should       = require('chai').should()
var expect       = require('chai').expect
var XHR = require('../../src/utils/xhr/xhr').XHR


describe('XHR provider', function() {

  describe('XHR - HTTP Provider', function(){

    describe('success', function(){
      it('should extract data from HTTP response - default schema to res = {data : {data : value}}', function(){

        const XHRInstance = new XHR({})
        const value = 'success'
        const res = {
          data : {
            data : value
          }
        }


        XHRInstance.extractData(res).should.equal(value)
      })

      it('should extract error from HTTP response - custom schema', function(){

        const XHRInstance = new XHR({
          responseSchemas : {
            http : {
              success : 'data.data.data'
            }
          }
        })
        const value = 'success'
        const res = {
          data : {
            data : {
              data : value
            }
          }
        }

        XHRInstance.extractData(res).should.equal(value)
      })
    })

    describe('error', function(){
      it('should extract error from HTTP response - default schema to res = {data : {data : value}}', function(){

        const XHRInstance = new XHR({})
        const value = 'error'
        const res = {
          data : value
        }

        XHRInstance.extractError(res).should.equal(value)
      })

      it('should extract error from HTTP response - custom schema', function(){

        const XHRInstance = new XHR({
          responseSchemas : {
            http : {
              error : 'data.data.data'
            }
          }
        })
        const value = 'error'
        const res = {
          data : {
            data : {
              data : value
            }
          }
        }

        XHRInstance.extractError(res).should.equal(value)
      })
    })
  })


  describe('XHR - Socket Provider', function(){

    describe('success', function(){
      it('should extract data from HTTP response - default schema to res = {data : {data : value}}', function(){

        const XHRInstance = new XHR({socket : true})
        const value = 'success'

        expect(XHRInstance.extractError(value)).to.equal(value)

      })

      it('should extract error from HTTP response - custom schema', function(){

        const XHRInstance = new XHR({
          socket : true,
          responseSchemas : {
            socket : {
              success : 'data.data.data'
            }
          }
        })
        const value = 'success'
        const res = {
          data : {
            data : {
              data : value
            }
          }
        }

        XHRInstance.extractData(res).should.equal(value)
      })
    })

    describe('error', function(){
      it('should extract data from HTTP response - default schema to res = {data : {data : value}}', function(){

        const XHRInstance = new XHR({socket : true})
        const value = 'error'

        expect(XHRInstance.extractError(value)).to.equal(value)
      })

      it('should extract error from HTTP response - custom schema', function(){

        const XHRInstance = new XHR({
          socket : true,
          responseSchemas : {
            socket : {
              error : 'data.data.data'
            }
          }
        })
        const value = 'error'
        const res = {
          data : {
            data : {
              data : value
            }
          }
        }

        XHRInstance.extractError(res).should.equal(value)
      })
    })




  })

})
