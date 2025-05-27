
import DoshaQuiz from "../../components/DoshaQuiz/DoshaQuiz";
import DoshaPostsQuiz from "../../components/DoshaPostsQuiz/DoshaPostsQuiz";

function DoshaPage() {

  return (
    <>
      <div className="flex mt-20 p-4 max-w-[100rem] mx-auto justify-between gap-20">
          <DoshaQuiz />
          <DoshaPostsQuiz />
      </div>
    </>
  )
}

export default DoshaPage