import { Box, TextField, MenuItem } from "@mui/material"

interface Props {
  search: string
  setSearch: (value: string) => void
  sort: "asc" | "desc"
  setSort: (value: "asc" | "desc") => void
  setPage: (page: number) => void
}

export default function OrdersControls({
  search,
  setSearch,
  sort,
  setSort,
  setPage,
}: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

      {/* SEARCH INPUT */}
      <TextField
        size="small"
        label="Search order / product"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />

      {/* SORT SELECT */}
      <TextField
        select
        size="small"
        label="Sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as "asc" | "desc")}
      >
        <MenuItem value="desc">Newest first</MenuItem>
        <MenuItem value="asc">Oldest first</MenuItem>
      </TextField>

    </Box>
  )
}