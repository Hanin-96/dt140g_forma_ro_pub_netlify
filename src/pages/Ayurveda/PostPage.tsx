import { observer } from "mobx-react-lite"
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { postStore } from "../../stores/PostStore";
import parse from 'html-react-parser';
import { PostTags } from "../../types/PostType";
import LoadingSpinnerStyle from '../../components/LoadingSpinner/LoadingSpinnerStyle.module.css';

const PostPage = observer(() => {
  const { postId } = useParams();

  useEffect(() => {
    if (postId) {
      //postStore.getAllPosts(37)
      postStore.getPostById(postId);

    }

  }, [postId]);

  return (
    <>
    {postStore.loading && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
      {postStore.post && (
        <div className="max-w-[100rem] w-full mx-auto mt-10">
          <div className="flex flex-col justify-between gap-10 border-[1px] border-forma_ro_grey rounded-2xl p-8 relative">
            <h1 className="max-w-[60rem] w-full">{postStore.post.title}</h1>
            <p className="absolute top-0 right-0 p-8 text-[15px]">Ayurveda inlägg</p>
            <p>{postStore.post.date ? new Date(postStore.post.date).toLocaleDateString() : ""}</p>

            <div className="border-t-[1px] border-b-[1px] border-forma_ro_grey flex gap-10">
              {postStore.post.tags.map((postTag: PostTags) => (
                postTag && (
                  <p key={postTag.id}>{postTag.name}</p>
                )
              ))}
            </div>

            <div className="flex gap-10 justify-between">
              <div>
                <div className="max-w-[55ch] w-full">{
                  postStore.post.content && parse(postStore.post.content)}
                </div>
              </div>
              <img src={postStore.post.image} alt={postStore.post.image_alt} className="object-cover max-w-[50rem] max-h-[35rem] w-full rounded-2xl shadow-sm" />
            </div>
          </div>

          <div className="mt-10 text-white bg-forma_ro_blue p-2">
            <h3>Andra inlägg</h3>
          </div>
        </div>
      )}

    </>
  )
});

export default PostPage