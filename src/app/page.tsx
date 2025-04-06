"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Advocate, advocateSchema } from "@/db/schema";
import Pagination from "@/app/components/Pagination";
import { GetAdvocatesResponse } from "@/app/api/advocates/route";
import { usePagination } from "@/app/hooks/usePagination";

export default function Home() {
    const [advocates, setAdvocates] = useState<GetAdvocatesResponse>({
        data: [],
        pagination: {
            page: 1, pageSize: 0, totalItems: 0,
        },
    });
    const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

    const {page, setPage, pageSize, onPageSizeChange} = usePagination();

    useEffect(() => {
        console.log("fetching advocates...");

        fetch(`/api/advocates?page=${page}&pageSize=${pageSize}`).then((response) => {
            response.json().then((jsonResponse) => {
                const parsed = z.array(advocateSchema).parse(jsonResponse.data);
                setAdvocates({data: parsed as unknown as Advocate[], pagination: jsonResponse.pagination});
                setFilteredAdvocates(parsed);
            });
        });
    }, [page, pageSize]);

    const onSearchChange = (e: { target: { value: string; }; }) => {
        const searchTerm = e.target.value;

        console.log("filtering advocates...");

        const filteredAdvocates = advocates.data.filter((advocate) => {
            return (
                advocate.firstName.includes(searchTerm) ||
                advocate.lastName.includes(searchTerm) ||
                advocate.city.includes(searchTerm) ||
                advocate.degree.includes(searchTerm) ||
                (advocate.specialties as Advocate['specialties']).includes(searchTerm) ||
                JSON.stringify(advocate.yearsOfExperience).includes(searchTerm)
            );
        });

        setFilteredAdvocates(filteredAdvocates as Advocate[]);
    };

    const resetSearch = () => {
        (document.getElementById("search-input") as HTMLInputElement).value = "";
        setFilteredAdvocates(advocates.data as Advocate[]);
    };

    return (
        <main className="mx-24 my-8">

            <div className="navbar bg-base-100 shadow-sm mb-11">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Solace Advocates</a>
                </div>
                <div className="flex gap-4">

                    <select className="select" onChange={onPageSizeChange}>
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                        <option>20</option>
                    </select>

                    <input
                        id="search-input"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-auto"
                        onChange={onSearchChange}
                    />
                    <button className="btn btn-primary" onClick={resetSearch}>Reset Search</button>
                </div>
            </div>

            <div className="overflow-y-auto h-[70vh] mb-8">
                <table className="table table-striped table-pin-rows w-full]">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>City</th>
                            <th>Degree</th>
                            <th>Specialties</th>
                            <th>Years of Experience</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredAdvocates.map((advocate) => {
                        return (
                            <tr className="hover:bg-base-300" key={advocate.id}>
                                <td>{advocate.firstName}</td>
                                <td>{advocate.lastName}</td>
                                <td>{advocate.city}</td>
                                <td>{advocate.degree}</td>
                                <td>
                                    {advocate.specialties?.map((s) => (
                                        <div key={`${advocate.id}-${s}`}>{s}</div>
                                    ))}
                                </td>
                                <td>{advocate.yearsOfExperience}</td>
                                <td>{advocate.phoneNumber}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                totalItems={advocates.pagination.totalItems}
                pageSize={pageSize}
                setPage={setPage}
            />
        </main>
    );
}
