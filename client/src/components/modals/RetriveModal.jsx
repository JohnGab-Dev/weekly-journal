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
import { RetriveAccount } from "@/services/AdminServices"
 
export function RetrieveModal({openRet, setOpenRet, row, fetchUsers}){
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
            const response = await RetriveAccount(id)
            if(response.status === 200){
                toast.success(`${response.data.message}`,{
                duration: 4000,
                position: 'top-right',
                });
                setOpenRet(false)
                fetchUsers()
                setLoading(false)
            }
        }catch(error){
            console.error(error)
        }

    }
    return(
        <div>
            <AlertDialog open={openRet} onOpenChange={setOpenRet}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to retrieve this user?</AlertDialogTitle>
                    <AlertDialogDescription className="mb-10">
                        Retrieving an account means, giving access to the system.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <AlertDialogAction type="submit" disabled={loading}>{loading ? "Retrieving..." : "Retrieve"}</AlertDialogAction>
                    </form>
                    </AlertDialogFooter>
                </AlertDialogContent>       
            </AlertDialog>
        </div>
    )  
}