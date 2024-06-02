import { Stack, Typography } from "@mui/material";
import AddButton from "../components/AddButton";

function AllTasksPage() {
  return(
    <Stack>
      <Typography variant="h2">All Tasks Page</Typography>

      <AddButton />
    </Stack>
  );
}

export default AllTasksPage;