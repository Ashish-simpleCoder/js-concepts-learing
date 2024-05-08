import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function debounce<T extends (...args: any[]) => any>(cb: T, delay: number = 300) {
    let timer: NodeJS.Timeout

    return function (...args: Parameters<typeof cb>) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => cb.call(this, ...args), delay)
    }
}

// tests
describe("debounce", () => {

    beforeEach(() => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.useRealTimers()
    })

    it("should return debounced function", () => {
        const getUser = vi.fn((id: number) => { })
        const dbGetUser = debounce(getUser)
        expect(typeof dbGetUser).toBe("function")
        expect(getUser).not.toHaveBeenCalled()
    })

    it("should fire the callback after 300ms of delay", () => {
        const getUser = vi.fn((id: number) => { })
        const dbGetUser = debounce(getUser)

        dbGetUser(10)
        expect(getUser).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(getUser).not.toHaveBeenCalled()

        vi.advanceTimersByTime(200)
        expect(getUser).toHaveBeenCalledTimes(1)
        expect(getUser).toHaveBeenNthCalledWith(1, 10)

        dbGetUser(200)
        vi.advanceTimersByTime(600)
        expect(getUser).toHaveBeenCalledTimes(2)
        expect(getUser).toHaveBeenNthCalledWith(2, 200)
    })

    it("should fire the callback after with custom delay", () => {
        const getUser = vi.fn((id: number) => { })

        const dbGetUser = debounce(getUser, 600)

        dbGetUser(10)
        expect(getUser).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(getUser).not.toHaveBeenCalled()

        vi.advanceTimersByTime(500)
        expect(getUser).toHaveBeenCalledTimes(1)
        expect(getUser).toHaveBeenNthCalledWith(1, 10)

        dbGetUser(200)
        vi.advanceTimersByTime(600)
        expect(getUser).toHaveBeenCalledTimes(2)
        expect(getUser).toHaveBeenNthCalledWith(2, 200)
    })
})
