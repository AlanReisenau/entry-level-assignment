import {useMemo, useState} from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { StyledInput, StyledSelect } from "./styles";
import rowData from "./data.json";

type Row = {
  id: number;
  first_name: string;
  last_name: string;
  ip_address: string;
  balance: number;
};

function App() {
  const [search, setSearch] = useState<string>("");
  const [selectedRowID, setSelectedRowID] = useState<number | false>(false);

  // filtering should happen from the values in rowData, use the option to filter the desired column based on the user search.
  // colDefs should be dynamic, same work you do to the options can be done to it.
  // to style the input, you can just pass a prop similar

  const columnDefs = [
    { field: "id" },
    { field: "first_name" },
    { field: "last_name", onCellClicked: (e) => console.log("here", e) },
    {
      field: "ip_address",
      cellRenderer: (params) => {
        const currentNodeId = params.node.id;
        if (selectedRowID === params.data.id) {
          // in here you will check if you want to render the ip address or not.
          return params.value;
        }
        return "";
      },
      onCellClicked: (params) => {
        const currentNodeId = params.node.id;
        console.log("current cell clicked", currentNodeId);
        setSelectedRowID(params.data.id == selectedRowID ? false : params.data.id)// setSelectedRowID();
      },
    },
    { field: "balance", valueFormatter: (p) => `$${p.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` }, // in here you will finish formatting the balance,
  ] as const;

  const [selectedOption, setSelectedOption] =
    useState<(typeof columnDefs)[number]["field"]>("id");

  const options = () => {
    const opt: {
      label: string;
      value: string;
    }[] = [];

    const uniqueFields = new Set<string>();

    rowData.map((row: Row) => {
      return Object.entries(row).map((e) => {
        const [label] = e;
        if (!uniqueFields.has(label)) {
          uniqueFields.add(label);
          opt.push({
            label,
            value: label,
          });
        }
      });
    });

    return opt;
  };

  const filteredData = useMemo(() => {
    if (!search) return rowData;
    return rowData.filter((row: Row) => {
      const fieldValue = row[selectedOption];
      return fieldValue?.toString().toLowerCase().includes(search.toLowerCase());
    });
  }, [search, selectedOption, rowData]);

  const defaultColDef = {
    flex: 1,
  };

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: 500,
      }}
    >
      <StyledInput
        $yourProp={true}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <StyledSelect
        options={options()}
        value={selectedOption}
        onChange={(e) =>
          setSelectedOption(e as (typeof columnDefs)[number]["field"])
        }
      />
      <AgGridReact
          defaultColDef={defaultColDef}
          rowData={filteredData}
          columnDefs={columnDefs}
      />
    </div>
  );
}

export default App;
