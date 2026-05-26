import { Box, TextField, MenuItem } from "@mui/material"

export default function OrdersControls({
  search,
  setSearch,
  sort,
  setSort,
  setPage,
}: any) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <TextField
        size="small"
        label="Search order / product"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />

      <TextField
        select
        size="small"
        label="Sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
      >
        <MenuItem value="desc">Newest first</MenuItem>
        <MenuItem value="asc">Oldest first</MenuItem>
      </TextField>
    </Box>
  )
}