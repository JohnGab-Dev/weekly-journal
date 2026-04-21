import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {useState} from 'react'
import toast from 'react-hot-toast'
import { addReport } from "@/services/ReportServices"

function AddReport() {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
    defaultValues: {
      items: [{type: "", desc: "" }]
    }
  })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const onSubmit = async (data) => {
        
        try {
        setLoading(true)
        const formData = new FormData()

        formData.append("date", data.date)

        // file input (IMPORTANT)
        formData.append("image", data.image[0])

        formData.append("doc_desc", data.doc_desc)

        // nested items array
        data.items.forEach((item, index) => {
            formData.append(`items[${index}][type]`, item.type)
            formData.append(`items[${index}][desc]`, item.desc)
        })

        const response = await addReport(formData)
        
        if(response.status === 200){
            toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
            });
            
            reset()
            navigate('/home')
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
    <div className="bg-white rounded-xl">
        <div className="p-6 border-b">   
            <h1 className="text-xl font-semibold">Add New Report</h1>
            <h2 className="text-sm text-gray-700">Add your new accomplished report here.</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
            <div className='w-2xl flex flex-col gap-4'>
                <Field>
                    <FieldLabel htmlFor="date">Date</FieldLabel>
                    <Input id="date" type="date" 
                    {...register("date", { required: "Fulldate is required" })}
                    />
                    {errors.date && (
                            <p className="text-sm text-red-500">
                            {errors.date.message}
                            </p>
                        )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="image">Documentation</FieldLabel>
                    <Input id="image" type="file" {...register("image")}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="doc_desc">Documentation Description</FieldLabel>
                    <Textarea placeholder="Type the description here." id={"doc_desc"}
                    {...register("doc_desc")}
                    />
                </Field>
            </div>
            <div className="">
                <h1>Report fields</h1>
            </div>
            {fields.map((item, index) => (
                <div className='w-2xl flex flex-col p-4 bg-gray-50 rounded-lg' key={item.id}>
                    <div className="w-full flex gap-4">
                        
                        <Field className="w-[75%]">
                            <FieldLabel htmlFor={`items.${index}.desc`}>Description</FieldLabel>
                            <Textarea placeholder="Type the description here." id={`items.${index}.desc`}
                                {...register(`items.${index}.desc`, { required: "Description is required" })}
                                />
                                {errors.items?.[index]?.desc && (
                                    <p className="text-sm text-red-500">
                                        {errors.items[index].desc.message}
                                    </p>
                                )}
                        </Field>
                        <Field className="w-[25%]">
                            <FieldLabel htmlFor={`items.${index}.type`}>
                            Type
                            </FieldLabel>
                            <Controller
                            name={`items.${index}.type`}
                            control={control}
                            rules={{ required: "Please select a report type." }}
                            render={({ field }) => (
                                <>
                                <Select onValueChange={field.onChange} value={field.value}  className="w-full">
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="objective">Objective</SelectItem>
                                        <SelectItem value="reflection">Reflection</SelectItem>
                                        <SelectItem value="task_accomplished">Task Accomplished</SelectItem>
                                        <SelectItem value="knowledge">Knowledge</SelectItem>
                                        <SelectItem value="skills">Skills</SelectItem>
                                        <SelectItem value="values">Values</SelectItem>
                                    </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.items?.[index]?.type && (
                                    <p className="text-sm text-red-500">
                                        {errors.items[index].type.message}
                                    </p>
                                )}
                                </>
                            )}
                            />
                        </Field>
                        {index > 0 && (
                            <div className="flex justify-end items-start ">
                                <button type="button" className="text-sm flex items-center gap-1 text-gray-700 font-medium cursor-pointer hover:bg-slate-200 rounded-full p-[5px]" onClick={() => remove(index)}>
                                    <X size={15}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            
            <div className="w-full flex justify-end">
                <button type="button" onClick={() => append({ type: "", desc: "" })} className="text-sm flex items-center gap-1 hover:underline text-blue-600 font-medium cursor-pointer"><Plus size={10} /> Add another </button>
            </div>
            <div className="max-w-[7rem]">
                <Field>
                    <Button type="submit" disabled={loading}>{loading == true ? 'Adding...' : 'Add Report'}</Button>
                </Field>       
            </div>
        </form>
    </div>
    
  )
}

export default AddReport
