import svg1 from "./svg1.svg"
import svg2 from "./svg2.svg"
import svg3 from "./svg3.svg"

export function HuggingFaceChrome({
  space = "ai-stories-factory",
  username = "jbilcke-hf",
  avatar = "https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/2RK8J_YSNAK2ob8XZH7w2.jpeg"
}: {
  space: string
  username: string
  avatar: string
}) {

  return (
    <div className="
    from-gray-50-to-white text-md shadow-alternate fixed
    right-6 top-5 z-20 flex h-[40px] items-stretch gap-3
    overflow-hidden rounded-xl
    border border-gray-200 bg-gradient-to-t pl-4
    text-gray-500 dark:border-gray-800 max-sm:hidden
    ">
      <div className="flex flex-none items-center">
        <div className="relative mr-1.5 flex items-center">
          <img alt="" className="w-3.5 h-3.5 rounded-full flex-none" src={`${avatar}`} crossOrigin="anonymous" />
        </div>
        <a href={`/${username}`} className="hover:text-blue-600">{username}</a>
        <div className="mx-0.5 text-gray-300">/</div>
        <a className="font-mono font-semibold text-gray-800 hover:text-blue-600" href={`/spaces/${username}/${space}`}>{space}</a>
      </div>
      <div className="inline-flex items-center overflow-hidden whitespace-nowrap rounded-md border bg-white text-sm leading-none text-gray-500  flex-none self-center ">
        <button className="relative flex items-center overflow-hidden from-red-50 to-transparent dark:from-red-900 p-1 hover:bg-gradient-to-t focus:outline-none" title="Unlike">
          {
          // svg1
        } {
            //svg2
          }
          <span className="ml-4 pl-0.5 hidden">like</span>
        </button>
        <button
          className="flex items-center border-l px-1.5 py-1 text-gray-400 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-900 dark:focus:bg-gray-800"
          title="See users who liked this repository">
            TODO
        </button>
      </div>
      <button
        className="relative flex h-[38px] w-[38px] items-center justify-center border-l border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        title="Show space menu">
        {
        //svg3
        }
      </button>
    </div>
  )
}