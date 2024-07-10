declare global {
    export type RootState = ReturnType<typeof import("@/app/store").store.getState>
    export type AppDispatch = typeof import("@/app/store").store.dispatch
}

export {}