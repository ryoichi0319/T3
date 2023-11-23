import { trpc } from "@/trpc/client";
import { postPerPage } from "@/lib/utils"
import PostItem from "@/components/post/PostItem";
import PaginationButton from "@/components/pagers/PaginationButton"
import { getAuthSession } from "@/lib/nextauth";

interface HomeProps{
  searchParams: {
    [key: string]: string | undefined
  }
}



const Home = async ({searchParams}: HomeProps) => {
  //urlのクエリパラメータからページ番号と1ページあたりの表示件数を取得
 const { page, perPage } = searchParams

const user = await getAuthSession()
 //データペースから取得する投稿の範囲を指定するための値を取得
 //limitは1ページあたりの表示件数　offsetは取得開始位置
 const limit = typeof perPage === "string" ? parseInt(perPage) : postPerPage
 const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

 const {posts, totalPosts } = await trpc.post.getPosts({
   userId: user?.id,
   limit,
   offset,
 })

  //投稿がない場合
  if(posts.length === 0){
    return(
      <div className=" text-center text-sm text-gray-500">投稿はありません</div>
    )
  }

  const pageCount = Math.ceil(totalPosts / limit)  
  //ページ数


  return(
    <div className=" space-y-5">
      <div className=" space-y-5">
      
      {posts.map((post) => (
        <PostItem key={post.id} post={post} userId={user?.id}/>
      ))}
      </div>
    {posts.length !== 0 && (
      <PaginationButton pageCount={pageCount} displayPerPage={postPerPage} />
    )}
    </div>
  )

}

export default Home