import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { DelUser } from "@/services/AdminServices"
 
export function DeleteModal({openDel, setOpenDel, row, fetchUsers}){
    const [id, setId] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if(row){
            setId(row.userId)
        }
        
    }, [row])


    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const response = await DelUser(id)
            if(response.status === 200){
                toast.success(`${response.data.message}`,{
                duration: 4000,
                position: 'top-right',
                });
                setOpenDel(false)
                fetchUsers()
                setLoading(false)
            }
        }catch(error){
            console.error(error)
        }

    }
    return(
        <div>
            <AlertDialog open={openDel} onOpenChange={setOpenDel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                    <AlertDialogDescription className="mb-10">
                        Once action is executed, it cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <AlertDialogAction type="submit" variant="destructive" disabled={loading}>{loading ? "Deleting..." : "Delete"}</AlertDialogAction>
                    </form>
                    </AlertDialogFooter>
                </AlertDialogContent>       
            </AlertDialog>
        </div>
    )  
}