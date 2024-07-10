export const Sidebar = () => {
  return (
    <aside
      className={
        'fixed top-14 z-30 hidden h-[calc(100vh-var(--header-height))] w-full shrink-0 md:sticky md:block'
      }
    >
      <div className={'pt-[16px] flex flex-col gap-5'}>
        <div></div>
      </div>
    </aside>
  )
}
