import {useState} from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import "./AssignmentList.css";
import {Container} from "react-bootstrap";

export default function Table({columns,data}){
const [filterInput,setFilterInput] =useState("");
    const [filterInput2,setFilterInput2] =useState("");
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable(
        {
            columns,
            data
        },
        useFilters,
        useSortBy
    );
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("articleName", value);
        setFilterInput(value);
    };
    const handleFilterChange2 = e => {
        const value2 = e.target.value || undefined;
        setFilter("className", value2);
        setFilterInput2(value2);
    };
    return (
        <Container className={"mt-3"} style={{"maxWidth": "1600px"}}>
            <br/><br/>
            <input
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={"Search by article name"}
            />
            &nbsp;&nbsp;
            <input
                value={filterInput2}
                onChange={handleFilterChange2}
                placeholder={"Search by class name"}
            />
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={
                                    column.isSorted
                                        ? column.isSortedDesc
                                        ? "sort-desc"
                                        : "sort-asc"
                                        : ""
                                }
                            >
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </Container>
    );
}