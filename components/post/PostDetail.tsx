"use client"

import { Post, User, Comment, CommentLike , Like} from "@prisma/client"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { trpc } from "@/trpc/react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import CommentDetail from "@/components/comment/CommentDetail"
import PostLikeDetail2 from "./PostLikeDetail2"

interface PostDetailProps {
  post: Post & { user: Pick<User, "id" | "name" | "image"> } & { like: Like[] };
  po: {
    hasPostLiked: boolean;
    postLikeId: string | null;
  };
  userId?: string;
  comments: (Comment & { user: Pick<User, "id" | "name" | "image"> } & {
    hasLiked: boolean;
    commentLikeId: string | null;
  } & { likes: CommentLike[] })[];
  pageCount: number;
  totalComments: number;
}
  
// 投稿詳細
const PostDetail = ({
  post,
  po,
  userId,
  comments,
  pageCount,
  totalComments,
  
}: PostDetailProps) => {
  const router = useRouter()

 // 投稿削除
const { mutate: deletePost, isLoading } = trpc.post.deletePost.useMutation({
  onSuccess: () => {
    toast.success("投稿を削除しました")
    router.refresh()
    router.push(`/`)
  },
  onError: (error) => {
    toast.error(error.message)
    console.error(error)
  },
})

  // 削除ボタンクリック時の処理
const handleDeletePost = () => {
  if (post.user.id !== userId) {
    toast.error("投稿は削除できません")
    return
  }

  // 投稿削除
  deletePost({
    postId: post.id,
  })
}
// console.log(post, "post66")

return (
  <div className="space-y-5">
    <div className="font-bold text-2xl break-words">{post.title}</div>
    <div>
      <Link href={`/author/${post.user.id}`}>
        <div className="flex items-center space-x-1">
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image
              src={post.user.image || "/default.png"}
              className="rounded-full object-cover"
              alt={post.user.name || "avatar"}
              fill
            />
          </div>
          <div className="text-sm hover:underline break-words min-w-0">
            {post.user.name} |{" "}
            {format(new Date(post.updatedAt), "yyyy/MM/dd HH:mm")}
          </div>
        </div>
      </Link>
    </div>


          <div className=" aspect-[16/9] relative">
              <Image
                  fill
                  src={post.image || "/noImage.png"}
                  alt="thumbnail"
                  className="object-cover rounded-md"
                  />
          </div>

          <div className=" leading-relaxed break-words whitespace-pre-wrap">
              {post.content}
          </div>
          <div className="flex justify-end mr-5">
          <PostLikeDetail2  post={post} po={po} userId={userId}/>
          </div>
          {/* 認証ユーザーと投稿者が一致している場合表示*/}
          {userId === post.user.id && (
              <div className=" flex items-center justify-end space-x-1">
                            {/* <PostLikeDetail post={post}  userId={userId}/> */}

                  <Link href={`/post/${post.id}/edit`}>
                      <div className=" hover:bg-gray-100 p-2 rounded-full">
                          <Pencil className=" w-5 h-5" />
                      </div>
                  </Link>

                  <button
                  className=" hover:bg-gray-100 p-2 rounded-full"
                  disabled={isLoading}
                  onClick={handleDeletePost}
                  >
                      <Trash2 className=" w-5 h-5 text-red-500" />
                  </button>
              </div>

          )} 
          <CommentDetail
              userId={userId}
              postId={post.id}
              comments={comments} 
              pageCount={pageCount}
              totalComments={totalComments}
              />
      </div>
  )

}
export default PostDetail