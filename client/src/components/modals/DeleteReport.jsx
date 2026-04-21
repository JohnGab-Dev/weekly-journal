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
import { delReportDate } from "@/services/ReportServices"
 
export function DeleteModal({openDel, setOpenDel, rowId, fetchTaskEvents}){
    const [id, setId] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if(rowId){
            setId(rowId)
        }
    }, [rowId])


    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const response = await delReportDate(id)
            if(response.status === 200){
                toast.success(`${response.data.message}`,{
                duration: 4000,
                position: 'top-right',
                });
                setOpenDel(false)
                fetchTaskEvents()
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
                    <AlertDialogTitle>Are you sure you want to delete this report?</AlertDialogTitle>
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