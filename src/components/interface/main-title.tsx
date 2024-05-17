export function MainTitle() {
  return (
    <div className="flex flex-col justify-start">
      <div className="
      flex flex-row
      items-center justify-center
      transition-all duration-200 ease-in-out
      px-3
      
      rounded-full">
      <div
      className="
        flex
        transition-all duration-200 ease-in-out
        items-center justify-center text-center
        w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
        text-3xl md:text-4xl lg:text-5xl
        rounded-lg
        mr-2
        font-sans
        bg-amber-400 dark:bg-amber-400
      
        text-stone-950/80 dark:text-stone-950/80 font-bold
        "
        >AI</div>
        <div
          className="
          transition-all duration-200 ease-in-out
          text-amber-400 dark:text-amber-400
          text-3xl md:text-4xl lg:text-5xl
          "
          style={{ textShadow: "#00000035 0px 0px 2px" }}
      
          /*
          className="
          text-5xl
          bg-gradient-to-br from-yellow-300 to-yellow-500
          inline-block text-transparent bg-clip-text
          py-6
          "
          */
        >Stories Factory</div>
      </div>
      <p
        className="
        transition-all duration-200 ease-in-out
        text-stone-900/90 dark:text-stone-900/90
        text-lg md:text-xl lg:text-2xl
        text-center 
        pt-2 md:pt-4
        "
        style={{ textShadow: "rgb(255 255 255 / 19%) 0px 0px 2px" }}
      >Make video stories using AI ✨</p>
    </div>
  )
}