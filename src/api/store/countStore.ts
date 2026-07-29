import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useCountStore = create(
    combine(
        { count: 0, double: 0 },
        set => ({
            increase: () =>
                set(state => ({
                    count: state.count + 1,
                    double: (state.count + 1) * 2
                })),
            decrease: () =>
                set(state => ({
                    count: state.count - 1,
                    double: (state.count - 1) * 2
                }))
        })
    )
)

export const useCountStoreV2 = create<{
    count: number
    actions: {
        increase: () => void
        decrease: () => void
    }
}>(set => ({
   count: 1,
   actions: {
    increase: () => set(state => ({ count: state.count + 1 })),
    decrease: () => set(state => ({ count: state.count - 1 }))
   } 
}))

