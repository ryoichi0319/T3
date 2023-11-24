"use client"

import { Post, Like, User} from "@prisma/client"
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { trpc } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface PostLikeDetailProps{
    post: Post & { user: Pick<User, "id" | "name" | "image">} & { like: Like[]}
   & { like: Like[]}
   po:  {hasPostLiked: boolean, postLikeId: string | null}

   
 
    userId?: string
    
}

const PostLikeDetail2 = ({post, userId, po}: PostLikeDetailProps,) =>{
    const router = useRouter()
    const [hasPostLiked, setHasPostLiked] = useState<boolean>(po.hasPostLiked)
    const [likePostCount, setLikePostCount] = useState<number>(post.like.length)

    
    //いいね追加
    const { mutate: createPostLike, isLoading: createPostLikeLoading} =
    trpc.post.createPostLike.useMutation({
        onSuccess: () =>{
            router.refresh()
        },
        onError: (error) => {
            console.error(error)

            if(likePostCount > 0){

                setHasPostLiked(false)
                setLikePostCount(likePostCount - 1)

            }
        },

    })
    //いいね削除
    const {mutate: deletePostLike , isLoading: deletePostLikeLoading } = 
    trpc.post.deletePostLike.useMutation({
        onSuccess: () => {
            router.refresh()
        },
        onError: (error) =>{
            console.error(error)
            setHasPostLiked(true)
            setLikePostCount(likePostCount + 1)
        }
       
     })
     const handleCreatePostLike = () => {
        
        setHasPostLiked(true)
        setLikePostCount(likePostCount + 1)

        createPostLike({
            postId: post.id,
        })
     }
     const handleDeletePostLike = () =>{
        if(!po.postLikeId){
            return
        }
        if(likePostCount > 0){
            setHasPostLiked(false)
            setLikePostCount(likePostCount - 1)
        }

        deletePostLike({
            postLikeId: po.postLikeId,
            
        })
     }

     return(
        <div className=" flex items-center">

            {hasPostLiked ? (
                
                <button
                   className="hover:bg-gray-100 p-2 rounded-full"
                   disabled={createPostLikeLoading || deletePostLikeLoading}
                   onClick={handleDeletePostLike}
                   >
                    <HeartFilledIcon className=" w-5 h-5 text-pink-500" />
                   </button>    
            ): (
                <button 
                    className={cn("p-2", userId && "hover:bg-gray-100 rounded-full")}
                    disabled={
                     createPostLikeLoading || deletePostLikeLoading || !userId
                    }
                    onClick={handleCreatePostLike}
                    >
                        <HeartIcon className=" w-5 h-5" />
                    
                </button>
            )}
            {likePostCount > 0 && <div className=" pr-1">{likePostCount}</div>}
        </div>
     )
} 
export default PostLikeDetail2