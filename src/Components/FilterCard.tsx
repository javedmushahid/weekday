import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { FilterOptions, Job } from "../../pages";

const FilterCard: React.FC<{
  filterOptions: FilterOptions;
  setFilteredJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  jobs: Job[];
}> = ({ filterOptions, setFilteredJobs, jobs }) => {
  const [selectedFilter, setSelectedFilter] = useState<
    { type: string; value: string }[]
  >([]);
  const [companySearch, setCompanySearch] = useState("");
  const [debouncedCompanySearch, setDebouncedCompanySearch] = useState("");

  const isLargeScreen = useMediaQuery("(min-width:960px)");

  const capitalize = (str: String) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char: String) => char.toUpperCase());
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCompanySearch(companySearch);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [companySearch]);

  useEffect(() => {
    const filteredJobs = filterJobs(selectedFilter, debouncedCompanySearch);
    setFilteredJobs(filteredJobs);
  }, [selectedFilter, debouncedCompanySearch, setFilteredJobs]);

  const handleCompanySearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchQuery = event.target.value;
    setCompanySearch(searchQuery);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    filterType: string
  ) => {
    const selectedValue = event.target.value as string;

    const updatedSelectedFilters = [...selectedFilter];
    const existingFilterIndex = updatedSelectedFilters.findIndex(
      (filter) => filter.type === filterType
    );
    if (existingFilterIndex !== -1) {
      updatedSelectedFilters[existingFilterIndex].value = selectedValue;
    } else {
      updatedSelectedFilters.push({ type: filterType, value: selectedValue });
    }

    setSelectedFilter(updatedSelectedFilters);

    const filteredJobs = filterJobs(updatedSelectedFilters, companySearch);
    setFilteredJobs(filteredJobs);
  };

  // const handleCompanySearchChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const searchQuery = event.target.value;
  //   setCompanySearch(searchQuery);

  //   const filteredJobs = filterJobs(selectedFilter, searchQuery);
  //   setFilteredJobs(filteredJobs);
  // };

  const filterJobs = (
    filters: { type: string; value: string }[],
    companyName: string
  ) => {
    return jobs.filter((job: Job) => {
      const matchesFilters = filters.every((filter) => {
        switch (filter.type) {
          case "minExp":
            return job.minExp === Number(filter.value);
          case "location":
            return job.location === filter.value;
          case "jobRole":
            return job.jobRole === filter.value;
          case "minJdSalary":
            return job.minJdSalary === Number(filter.value);
          default:
            return true;
        }
      });

      const matchesCompanySearch =
        companyName.trim() === "" ||
        job.companyName.toLowerCase().includes(companyName.toLowerCase());

      return matchesFilters && matchesCompanySearch;
    });
  };

  return (
    <Card sx={{ p: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              select
              fullWidth
              label="Min Experience"
              variant="outlined"
              defaultValue=""
              value={
                selectedFilter.find((filter) => filter.type === "minExp")
                  ?.value || ""
              }
              onChange={(event) => handleFilterChange(event, "minExp")}
            >
              {filterOptions.experience
                .map((exp: any) => Number(exp))
                .sort((a: number, b: number) => a - b)
                .map((exp: number, index: number) => (
                  <MenuItem key={index} value={exp}>
                    {exp}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              fullWidth
              label="Search Company Name"
              variant="outlined"
              defaultValue={companySearch}
              onChange={handleCompanySearchChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              select
              fullWidth
              label="Location"
              variant="outlined"
              defaultValue=""
              value={
                selectedFilter.find((filter) => filter.type === "location")
                  ?.value || ""
              }
              onChange={(event) => handleFilterChange(event, "location")}
            >
              {filterOptions.locations.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {capitalize(location)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              select
              fullWidth
              label="Remote/On-site"
              variant="outlined"
              defaultValue=""
            >
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
            </TextField>
          </Grid>

          {/* NOT GETTING TECH STACK IN RESPONSE */}
          {/* <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              select
              fullWidth
              label="Tech Stack"
              variant="outlined"
              defaultValue=""
            >
              <MenuItem value="Any">Select All</MenuItem>
              <MenuItem value="Remote">Full Stack</MenuItem>
              <MenuItem value="Frontend">Frontend</MenuItem>{" "}
              <MenuItem value="Backend">Backend</MenuItem>{" "}
            </TextField>
          </Grid> */}
          <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              select
              fullWidth
              label="Roles"
              variant="outlined"
              defaultValue=""
              value={
                selectedFilter.find((filter) => filter.type === "jobRole")
                  ?.value || ""
              }
              onChange={(event) => handleFilterChange(event, "jobRole")}
            >
              {filterOptions.roles.map((role, index) => (
                <MenuItem key={index} value={role}>
                  {capitalize(role)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6} lg={isLargeScreen ? 2 : 12}>
            <TextField
              select
              fullWidth
              label="Min Base Pay"
              variant="outlined"
              value={
                selectedFilter.find((filter) => filter.type === "minPay")
                  ?.value || ""
              }
              onChange={(event) => handleFilterChange(event, "minJdSalary")}
              defaultValue=""
            >
              {filterOptions.minPay
                .map((exp: any) => Number(exp))
                .sort((a: number, b: number) => a - b)
                .map((exp: number, index: number) => (
                  <MenuItem key={index} value={exp}>
                    {exp}k USD
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
