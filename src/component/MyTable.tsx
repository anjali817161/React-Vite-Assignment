import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableSelectionChangeParams } from 'primereact/datatable'; // Ensure correct types are imported
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import './MyDataTable.css'; // Import the CSS file

interface DataRow {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    isSelected?: boolean;
}

const MyDataTable: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [columns, setColumns] = useState<{ id: boolean, name: boolean, country: boolean, company: boolean }>({
        id: true,
        name: true,
        country: true,
        company: true
    });
    const [selectedRows, setSelectedRows] = useState<DataRow[]>([]); // State for selected rows

    const op = useRef<OverlayPanel>(null);
    const op2 = useRef<OverlayPanel>(null);

    useEffect(() => {
        fetchData(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const fetchData = async (page: number, rows: number) => {
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`);
            const result = await response.json();
            const mappedData = result.data.map((item: any) => ({
                id: item.id,
                title: item.title || 'No Title',
                place_of_origin: item.place_of_origin || 'Unknown',
                artist_display: item.artist_display || 'Unknown',
                isSelected: false
            }));
            setData(mappedData);
            setTotalRecords(result.pagination.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onPageChange = (event: any) => {
        setCurrentPage(event.page + 1); // PrimeReact page is 0-based
    };

    const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (!isNaN(value) && value > 0) {
            setRowsPerPage(value);
            setCurrentPage(1); // Reset to the first page
        }
    };

    const toggleColumn = (column: 'id' | 'name' | 'country' | 'company') => {
        setColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    // Correct typing for onSelectionChange
    const onSelectionChange = (e: DataTableSelectionChangeParams) => {
        setSelectedRows(e.value as DataRow[]); // Ensure that selected rows are typed correctly
    };

    return (
        <div className="data-table-container">
            <div className="table-header">
                <span className="column-selector-button">
                    <Button icon="pi pi-cog" onClick={(e) => op.current?.toggle(e)} >
                        Hide Categories
                    </Button>
                </span>
                <span className="column-selector-button">
                    <Button icon="pi pi-list" onClick={(e) => op2.current?.toggle(e)} >
                        Select Rows no.
                    </Button>
                </span>
                <OverlayPanel ref={op}>
                    <div>
                        <div>
                            <Checkbox
                                checked={columns.id}
                                onChange={() => toggleColumn('id')}
                            /> ID
                        </div>
                        <div>
                            <Checkbox
                                checked={columns.name}
                                onChange={() => toggleColumn('name')}
                            /> Name
                        </div>
                        <div>
                            <Checkbox
                                checked={columns.country}
                                onChange={() => toggleColumn('country')}
                            /> Country
                        </div>
                        <div>
                            <Checkbox
                                checked={columns.company}
                                onChange={() => toggleColumn('company')}
                            /> Company
                        </div>
                    </div>
                </OverlayPanel>
                <OverlayPanel ref={op2}>
                    <div className="row-options">
                        <label htmlFor="rowsPerPage">Rows per page:</label>
                        <input
                            id="rowsPerPage"
                            type="number"
                            value={rowsPerPage}
                            onChange={onRowsPerPageChange}
                            min="1"
                        />
                    </div>
                </OverlayPanel>
            </div>
            <DataTable
                value={data}
                paginator={false}
                responsiveLayout="scroll"
                selection={selectedRows}
                onSelectionChange={onSelectionChange}
                dataKey="id" // Add this to uniquely identify rows
            >
                {/* Column for checkboxes */}
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column> {/* Checkboxes will be rendered here */}
                
                {columns.id && <Column field="id" header="ID" />}
                {columns.name && <Column field="title" header="Name" />}
                {columns.country && <Column field="place_of_origin" header="Country" />}
                {columns.company && <Column field="artist_display" header="Company" />}
            </DataTable>
            <Paginator
                first={(currentPage - 1) * rowsPerPage}
                rows={rowsPerPage}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                rowsPerPageOptions={[]}
            />
        </div>
    );
};

export default MyDataTable;
