import FilterCard from "@/Components/FilterCard";
import JobCard from "@/Components/JobCard";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

export interface Job {
  jdUid: string;
  jdLink: string;
  jobDetailsFromCompany: string;
  maxJdSalary: number;
  minJdSalary: number;
  salaryCurrencyCode: string;
  location: string;
  minExp: number;
  maxExp: number;
  jobRole: string;
  companyName: string;
  logoUrl: string;
  experience: string;
}
export interface FilterOptions {
  roles: string[];
  locations: string[];
  experience: number[];
  minPay: number[];
}
const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    roles: [],
    locations: [],
    experience: [],
    minPay: [],
  });
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [noResults, setNoResults] = useState(false);

  const page = useRef(0);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting && !loading && hasMore) {
          loadJobs();
        }
      },
      { threshold: 1 }
    );

    observer.observe(document.getElementById("observer")!);

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        {
          limit: 12,
          offset: page.current * 10,
        }
      );

      const newJobs: Job[] = response.data.jdList;

      setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      setHasMore(newJobs.length > 0);
      page.current += 1;
      const uniqueRoles = Array.from(
        new Set(newJobs.map((job) => job.jobRole))
      ) as string[];
      const uniqueLocations = Array.from(
        new Set(newJobs.map((job) => job.location))
      ) as string[];
      const uniqueExperience = Array.from(
        new Set(newJobs.map((job) => job.minExp))
      ) as number[];
      const uniqueminPay = Array.from(
        new Set(newJobs.map((job) => job.minJdSalary))
      ) as number[];
      setFilterOptions({
        roles: uniqueRoles,
        locations: uniqueLocations,
        experience: uniqueExperience,
        minPay: uniqueminPay,
      });
      applySelectedFilters(newJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applySelectedFilters = (newJobs: Job[]) => {
    if (filteredJobs.length === 0) {
      setFilteredJobs(newJobs);
      setNoResults(newJobs.length === 0);
      return;
    }

    const filteredNewJobs = newJobs.filter((job) => {
      return filteredJobs.some((filteredJob) => {
        return Object.keys(filteredJob).every((key) => {
          return filteredJob[key as keyof Job] === job[key as keyof Job];
        });
      });
    });

    // If there are no search results, do not update the filtered jobs and set the noResults state
    if (filteredNewJobs.length === 0) {
      setNoResults(true);
      return;
    }

    setFilteredJobs(filteredNewJobs);
    setNoResults(false);
  };

  return (
    <Box ml={2} mr={2}>
      <FilterCard
        filterOptions={filterOptions}
        setFilteredJobs={setFilteredJobs}
        jobs={jobs}
      />
      {noResults && (
        <Typography
          variant="body1"
          color="error"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          No results found.
        </Typography>
      )}
      <Box mt={2}>
        <Grid container spacing={4}>
          {filteredJobs.map((job: Job, index: number) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={4} xl={4}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <div id="observer" style={{ height: "1px", visibility: "hidden" }} />
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      )}{" "}
      {!loading && !hasMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          No more jobs to load.
        </div>
      )}
    </Box>
  );
};

export default Index;
