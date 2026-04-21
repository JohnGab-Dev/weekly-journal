import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react'
import { useForm} from 'react-hook-form';
import { EditTask } from "@/services/StudentServices"
import toast from 'react-hot-toast'

export function EditModal({ openEdit, setOpenEdit, fetchTasks, row }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId]= useState()

  useEffect(()=>{
    if(row){
        reset(
            {
            date: row.date,
            task_accomplished: row.task_accomplished,
            knowledge: row.knowledge,
            skill: row.skills,
            values: row.values,
            }
        )
        setId(row.reportId)
    }
  }, [row, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData();

      formData.append("date", data.date);
      formData.append("task_accomplished", data.task_accomplished);
      formData.append("knowledge", data.knowledge || "");
      formData.append("skill", data.skill || "");
      formData.append("values", data.values || "");

      // ✅ VERY IMPORTANT
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      const response = await EditTask(id, formData)
      console.log(response.data.message)      
      if(response.status === 200){
        toast.success(`${response.data.message}`,{
          duration: 4000,
          position: 'top-right',
        });
        
        setOpenEdit(false)
        fetchTasks()
      }

    } catch (error) {
      if (error.response) {
        toast.error(`${error.response.data.message}`,{
          duration: 4000,
          position: 'top-right',
        });
        console.error("Server Error:", error.response.data.message)
      } else if (error.request) {
        console.error("No response from server")
      } else {
        console.error("Request error:", error.message)
      }
    }finally{
      setLoading(false)
    }
  }
  return (
    <Dialog  open={openEdit} onOpenChange={setOpenEdit}>
       
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit a report</DialogTitle>
            <DialogDescription>
              Make sure to fill all fields
            </DialogDescription>
          </DialogHeader>
           <form onSubmit={handleSubmit(onSubmit)} >
            <div className="flex gap-2">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="date">Date</FieldLabel>
                        <Input id="date" type="date" placeholder="John Doe" 
                        {...register("date", { required: "Date is required" })}
                        />
                        {errors.date && (
                                <p className="text-sm text-red-500">
                                {errors.date.message}
                                </p>
                            )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="task_accomplished">Task Accomplished</FieldLabel>
                        <Input id="task_accomplished" type="text"
                        {...register("task_accomplished", { required: "Task Accomplished is required" })}
                        />
                        {errors.task_accomplished && (
                                <p className="text-sm text-red-500">
                                {errors.task_accomplished.message}
                                </p>
                            )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="knowledge">Knowledge</FieldLabel>
                        <Input id="knowledge" type="text" {...register("knowledge")}/>
                    </Field>
                </FieldGroup>
                <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="skill">Skills</FieldLabel>
                            <Input id="skill" type="text" {...register("skill")}/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="values">Values</FieldLabel>
                            <Input id="values" type="text" {...register("values")}/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="image">Documentation(once per day)</FieldLabel>
                            <Input id="image" type="file" {...register("image")} />
                            <FieldDescription className="text-xs">
                                This replaces the existing image of the day
                            </FieldDescription>
                        </Field>
                </FieldGroup>
            </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      
    </Dialog>
  )
}
