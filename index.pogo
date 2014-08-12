module.exports (fn, timeout: 1000, interval: 10) =
  startTime = @new Date().getTime()

  retryLoop () =
    try
      fn()!
    catch (e)
      now = @new Date().getTime()
      
      if (now < startTime + timeout)
        wait (interval)!
        retryLoop ()!
      else
        @throw e

  retryLoop()!

wait (n)! = setTimeout(^, n)
