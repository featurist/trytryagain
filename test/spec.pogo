retry = require '..'
chai = require 'chai'
expect = chai.expect
chai.use(require 'chai-as-promised')

describe 'trytryagain'
  it 'retries for up to a second, throwing the last exception'
    timing = time!
      expect (retry @{
        @throw @new Error "uh oh"
      }).to.be.rejectedWith 'uh oh'!

    expect(timing.duration).to.be.within 1000 1050

  it 'retries until no exceptions are thrown, then returns result'
    n = 0

    result = retry!
      ++n

      if (n < 10)
        @throw @new Error "uh oh"
      else
        n

    expect(result).to.equal 10

  it 'passes immediately if no exceptions are thrown'
    result = retry!
     'result'

    expect(result).to.equal 'result'

  it 'can set the timeout duration'
    timing = time!
      expect (retry (timeout = 200) @{
        @throw @new Error "uh oh"
      }).to.be.rejectedWith 'uh oh'!

    expect(timing.duration).to.be.within 200 220

  it 'interval is 10ms by default'
    last = @new Date().getTime()
    intervals = []

    expect (retry @{
      current = @new Date().getTime()
      intervals.push(current - last)
      last := current

      @throw @new Error "uh oh"
    }).to.be.rejectedWith 'uh oh'!

    expect(intervals.0).to.be.within 0 2
    remaining = intervals.slice 1
    expect(avg(remaining)).to.be.within 10 13

  it 'interval can be set'
    last = @new Date().getTime()
    intervals = []

    expect (retry (interval = 200) @{
      current = @new Date().getTime()
      intervals.push(current - last)
      last := current

      @throw @new Error "uh oh"
    }).to.be.rejectedWith 'uh oh'!

    expect(intervals.0).to.be.within 0 2
    remaining = intervals.slice 1
    expect(avg(remaining)).to.be.within 200 210

  describe 'ensuring'
    it 'makes the assertion repeatedly until timeout'
      lastResult = nil
      times = 0

      timing = time!
        retry.ensuring(duration = 200)!
          expect(5).to.equal 5
          lastResult := ++times

      expect(timing.duration).to.be.within 200 220
      expect(lastResult).to.equal(times)

    it 'it stops as soon as the block throws'
      times = 0

      timing = time!
        expect(retry.ensuring(duration = 200) @{
          expect(++times).to.be.below 5
        }).to.be.rejectedWith('expected 5 to be below 5')!

      expect(timing.duration).to.be.within 40 50

time (block)! =
  startTime = @new Date().getTime()
  result = block ()!
  endTime = @new Date().getTime()

  { result = result, duration = endTime - startTime }

sum (list) =
  list.reduce @(total, item) @{ total + item }
  
avg (list) =
  sum(list) / list.length
