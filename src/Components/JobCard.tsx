import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  SvgIcon,
  Avatar,
  Chip,
} from "@mui/material";
import SandClock from "@/SVGIcons/SandClock";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
interface Job {
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

const JobCard = ({ job }: { job: Job }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    companyName,
    jobRole,
    location,
    jobDetailsFromCompany,
    minJdSalary,
    maxJdSalary,
    experience,
    logoUrl,
    minExp,
  } = job;
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };
  const capitalize = (str: String) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char: String) => char.toUpperCase());
  };
  return (
    <Card
      sx={{
        p: 2,
        marginBottom: 2,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
      }}
    >
      <CardContent>
        <Box mb={3}>
          <Chip
            label="Posted 10 days ago"
            size="medium"
            avatar={<SandClock />}
            style={{
              padding: 10,
              backgroundColor: "#ffffff",
              color: "#555555",
              borderRadius: 10,
              border: "1px solid lightgray",
            }}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Box>
              <Box display="flex" gap={1.3}>
                <img
                  src={logoUrl}
                  style={{
                    width: "34px",
                    height: "54px",
                  }}
                />
                <Box>
                  <Typography variant="h5" fontSize={20} fontWeight={500}>
                    {companyName}
                  </Typography>
                  <Typography color="grey.700">
                    {capitalize(jobRole)}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {capitalize(location)}
                  </Typography>
                </Box>
              </Box>

              <Box mt={isSmallScreen ? 1 : 0}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography
                    variant="body2"
                    color="grey.700"
                    fontWeight={600}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Estimated Salary: ${minJdSalary || "-"} - $
                    {maxJdSalary || "-"} USD
                  </Typography>
                  <Box ml={1} display="flex" alignItems="center">
                    <CheckBoxIcon style={{ color: "green" }} />
                  </Box>
                </Box>
                <Typography variant="body2">
                  {" "}
                  <strong> About Company:</strong> <br />
                  <strong> About us</strong> <br />
                  {expanded
                    ? jobDetailsFromCompany
                    : `${jobDetailsFromCompany.substring(0, 400)}${
                        jobDetailsFromCompany.length > 100 ? "..." : ""
                      }`}
                </Typography>{" "}
              </Box>
              <Box
                mt={isSmallScreen ? 2 : 0}
                display="flex"
                justifyContent="center"
              >
                {jobDetailsFromCompany.length > 100 && (
                  <Button
                    onClick={toggleDescription}
                    color="primary"
                    size="small"
                  >
                    {expanded ? "Read less" : "Read more"}
                  </Button>
                )}
              </Box>
              <Box mt={isSmallScreen ? 2 : 0}>
                <Box mb={2}>
                  <Typography color="grey.700" fontWeight={500}>
                    Minimum Experience
                  </Typography>
                  <Typography>{minExp ? minExp : 1} years</Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#54efc3",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  <SvgIcon
                    viewBox="0 0 24 24"
                    style={{ fill: "yellow", marginRight: 5 }}
                  >
                    <path d="M19.0765 9.48063H12.1242L15.5905 0L5 14.5194H11.9522L8.48592 24L19.0765 9.48063Z" />
                  </SvgIcon>{" "}
                  Easy Apply
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    bgcolor: "blue",
                    color: "white",
                  }}
                >
                  Unlock referral asks{" "}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
