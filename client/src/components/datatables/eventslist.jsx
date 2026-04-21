import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent, 
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {EllipsisVertical} from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {Search} from 'lucide-react'
import Loader from '../loader'
import api from "@/axiosInstance/api"
import { useState, useEffect } from "react"
//modals
import { AddModal } from "@/components/modals/AddEventModal"
import { DeleteModal } from "@/components/modals/DeleteEvent"
import { EditModal } from "@/components/modals/EditEventModal"

//util
import { formatDateMDY } from "@/utils/DateFormatter"

function UserList() {

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("")
  const [page, setPage] = useState(1);
  const [data, setData] = useState([])
  const [lastPage, setLastPage] = useState(0)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDel, setOpenDel] = useState(false)
  const [selectedRow, setSelectedRow] = useState()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setTimeout(()=>{
      fetchData(search, page);
    }, 400)
  }, [search, page, date]);

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = `/events?page=${page}`;

      if (search !== "") {
        setDate("")
        url += `&search=${search}`;
      }
      if(date != ""){
        setSearch("")
        url += `&search=${date}`;
      }

      const response = await api.get(url);
      setData(response.data.data)
      setLastPage(response.data.meta.last_page)
      setPage(response.data.meta.current_page)

    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div>
      <EditModal openEdit={openEdit} setOpenEdit={setOpenEdit} row={selectedRow} fetchData={fetchData} />
      <DeleteModal  openDel={openDel} setOpenDel={setOpenDel} row={selectedRow} fetchData={fetchData} />
      <div className='p-6 rounded-lg border bg-white'>
          <div className='flex items-end justify-between gap-4 mb-4 w-full'>
              <div className='min-w-sm flex flex-col gap-2'>
                <Label htmlFor="search">Search</Label>
                <Input id="search" type='text' placeholder="search by title..." className="w-full" onChange={(e)=>(setSearch(e.target.value))}/>
              </div>

              <div className='min-w-sm flex flex-col gap-2'>
                <Label htmlFor="date">Filter by date</Label>
                <Input id="date" type='date' className="w-full" onChange={(e)=>(setDate(e.target.value))}/>
              </div>
              <Button variant="default" onClick={(e)=>{setOpenAdd(true);}}>Add Event</Button>
              <AddModal openAdd={openAdd} setOpenAdd={setOpenAdd} fetchData={fetchData} />
          </div>
        <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center relative py-10">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : data && data.length > 0 ? (data.map((row)=>(
              <TableRow key={row.eventId}>
                  <TableCell >{formatDateMDY(row.date)}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline"><EllipsisVertical /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={(e)=>{setOpenEdit(true); setSelectedRow(row)}}>Edit</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem variant="destructive" onClick={(e)=>{setOpenDel(true); setSelectedRow(row)}}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center">
                No results
              </TableCell>
            </TableRow>
          )}
              
          </TableBody>
          </Table>

          <Pagination>
            <PaginationContent>
                <PaginationItem>
                  <Button variant='outline' className='flex items-center text-sm font-medium' disabled={lastPage === 1} onClick={()=>(setPage(page - 1))}><ChevronLeft />Previous</Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant='outline' className='flex items-center text-sm font-medium px-3' onClick={()=>(setPage(1))}>1</Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant='outline' className='flex items-center text-sm font-medium px-3' disabled={lastPage < 2} onClick={()=>(setPage(2))}>2</Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant='outline' className='flex items-center text-sm font-medium px-3' disabled={lastPage < 3} onClick={()=>(setPage(3))}>3</Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <Button variant='outline' className='flex items-center text-sm font-medium px-3' onClick={()=>(setPage(lastPage))}>{lastPage}</Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant='outline' className='flex items-center text-sm font-medium' disabled={page === lastPage}onClick={()=>(setPage(page + 1))}>Next<ChevronRight /></Button>
                </PaginationItem>
            </PaginationContent>
          </Pagination>
      </div>
    </div>

  )
}

export default UserList
