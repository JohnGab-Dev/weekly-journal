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
import { AddUserModal } from "@/components/modals/AddUserModal"
import { ChangePass } from "@/components/modals/ChangePass"
import { DeleteModal } from "@/components/modals/DeleteUser"
import { EditUserModal } from "@/components/modals/EditUserModal"

function UserList() {

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // const [total, setTotal] = useState()
  const [users, setUsers] = useState([])
  const [lastPage, setLastPage] = useState(0)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDel, setOpenDel] = useState(false)
  const [openCpass, setOpenCpass] = useState(false)
  const [selectedRow, setSelectedRow] = useState()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setTimeout(()=>{
      fetchUsers(search, page);
    }, 400)
  }, [search, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true)
      let url = `/users?page=${page}`;

      if (search !== "") {
        url += `&search=${search}`;
      }

      const response = await api.get(url);
      setUsers(response.data.data)
      setLastPage(response.data.meta.last_page)
      // setTotal(response.data.meta.total)
      setPage(response.data.meta.current_page)

    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div>
      <ChangePass openCpass={openCpass} setOpenCpass={setOpenCpass} row={selectedRow}/>
      <EditUserModal openEdit={openEdit} setOpenEdit={setOpenEdit} row={selectedRow} fetchUsers={fetchUsers} />
      <DeleteModal  openDel={openDel} setOpenDel={setOpenDel} row={selectedRow} fetchUsers={fetchUsers} />
      <div className='p-6 rounded-lg border bg-white'>
          <div className='flex items-end justify-between gap-4 mb-4 w-full'>
              <div className='min-w-sm flex flex-col gap-2'>
                <Label htmlFor="username-1">Search</Label>
                <Input id="username-1" type='text' placeholder="search by name or email..." className="w-full" onChange={(e)=>(setSearch(e.target.value))}/>
              </div>
              <Button variant="default" onClick={(e)=>{setOpenAdd(true);}}>Add User</Button>
              <AddUserModal openAdd={openAdd} setOpenAdd={setOpenAdd} fetchUsers={fetchUsers} />
          </div>
        <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
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
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline"><EllipsisVertical /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => { setOpenEdit(true); setSelectedRow(user); }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setOpenCpass(true); setSelectedRow(user); }}>
                              Change Password
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => { setOpenDel(true); setSelectedRow(user); }}
                            >
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
