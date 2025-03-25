"use client";

import {useEffect, useState} from "react";
import {Advocate, advocateSchema} from "@/db/schema";
import {z} from "zod";

export default function Home() {
    const [advocates, setAdvocates] = useState<Advocate[]>([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

    useEffect(() => {
        console.log("fetching advocates...");
        fetch("/api/advocates").then((response) => {
            response.json().then((jsonResponse) => {
                const data = z.array(advocateSchema).parse(jsonResponse.data);
                setAdvocates(data);
                setFilteredAdvocates(data);
            });
        });
    }, []);

    const onSearchChange = (e: { target: { value: string; }; }) => {
        const searchTerm = e.target.value;

        console.log("filtering advocates...");
        const filteredAdvocates = advocates.filter((advocate) => {
            return (
                advocate.firstName.includes(searchTerm) ||
                advocate.lastName.includes(searchTerm) ||
                advocate.city.includes(searchTerm) ||
                advocate.degree.includes(searchTerm) ||
                advocate.specialties.includes(searchTerm) ||
                JSON.stringify(advocate.yearsOfExperience).includes(searchTerm)
            );
        });

        setFilteredAdvocates(filteredAdvocates);
    };

    const resetSearch = () => {
        (document.getElementById("search-input") as HTMLInputElement).value = "";
        setFilteredAdvocates(advocates);
    };

    return (
        <main style={{margin: "24px"}}>

            <div className="navbar bg-base-100 shadow-sm mb-12">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Solace Advocates</a>
                </div>
                <div className="flex gap-4">
                    <input
                        id="search-input"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-auto"
                        onChange={onSearchChange}
                    />
                    <button className="btn btn-primary" onClick={resetSearch}>Reset Search</button>
                </div>
            </div>

            <table className="table table-striped table-pin-rows">
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
                        <tr key={advocate.id}>
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
        </main>
    );
}
