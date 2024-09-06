import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Switch,
  Slider,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { tokens } from "../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import LineChart from "../components/LineChart";
import { useState, useEffect } from "react";
import { fetchLastData, updateFan, updateLed } from "../controllers/axios";

import io from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb as lightbulbOn,
  faFan,
  faTemperatureThreeQuarters,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

import { faLightbulb as lightbulbOff } from "@fortawesome/free-regular-svg-icons";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [temp, setTemp] = useState("0");
  const [humid, setHumid] = useState("0");
  const [conduct, setConduct] = useState("0");
  const [ph, setPH] = useState("0");
  const [nitrogen, setNitrogen] = useState("0");
  const [phosphorus, setPhosphorus] = useState("0");
  const [potassium, setPotassium] = useState("0");

  const [tempLoading, setTempLoading] = useState(true);
  const [humidLoading, setHumidLoading] = useState(true);
  const [conductLoading, setConductLoading] = useState(true);
  const [phLoading, setPHLoading] = useState(true);
  const [nitrogenLoading, setNitrogenLoading] = useState(true);
  const [phosphorusLoading, setPhosphorusLoading] = useState(true);
  const [potassiumLoading, setPotassiumLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const pushLog = (log) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
  };

  useEffect(() => {
    (async () => {
      const currentTemp = await fetchLastData("temp");
      setTemp(currentTemp);
      setTempLoading(false);

      const currentHumid = await fetchLastData("humid");
      setHumid(currentHumid);
      setHumidLoading(false);

      const currentConduct = await fetchLastData("conduct");
      setConduct(currentConduct);
      setConductLoading(false);

      const currentPH = await fetchLastData("ph");
      setPH(currentPH);
      setPHLoading(false);

      const currentNitrogen = await fetchLastData("nitrogen");
      setNitrogen(currentNitrogen);
      setNitrogenLoading(false);

      const currentPhosphorus = await fetchLastData("phosphorus");
      setPhosphorus(currentPhosphorus);
      setPhosphorusLoading(false);

      const currentPotassium = await fetchLastData("potassium");
      setPotassium(currentPotassium);
      setPotassiumLoading(false);
    })();
  }, []);

  useEffect(() => {
    console.log("Current data:", { temp, humid, conduct, ph, nitrogen, phosphorus, potassium });
  }, [temp, humid]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("tempUpdate", ({ temp }) => {
      console.log("Received data:", temp);
      setTemp(temp);
      pushLog({
        title: "Temperature",
        time: new Date().toLocaleTimeString(),
        value: `${temp}°C`,
      });
    });
    socket.on("humidUpdate", ({ humid }) => {
      console.log("Received data:", humid);
      setHumid(humid);
      pushLog({
        title: "Humidity",
        time: new Date().toLocaleTimeString(),
        value: `${humid}%`,
      });
    });
    socket.on("phUpdate", ({ ph }) => {
      console.log("Received data:", ph);
      setPH(ph);
      pushLog({
        title: "pH",
        time: new Date().toLocaleTimeString(),
        value: `${ph}`,
      });
    });
    socket.on("nitrogenUpdate", ({ nitrogen }) => {
      console.log("Received data:", nitrogen);
      setNitrogen(nitrogen);
      pushLog({
        title: "Nitrogen",
        time: new Date().toLocaleTimeString(),
        value: `${nitrogen} mg/kg`,
      });
    });
    socket.on("phosphorusUpdate", ({ phosphorus }) => {
      console.log("Received data:", phosphorus);
      setPhosphorus(phosphorus);
      pushLog({
        title: "Phosphorus",
        time: new Date().toLocaleTimeString(),
        value: `${phosphorus} mg/kg`,
      });
    });
    socket.on("potassiumUpdate", ({ potassium }) => {
      console.log("Received data:", potassium);
      setPotassium(potassium);
      pushLog({
        title: "Potassium",
        time: new Date().toLocaleTimeString(),
        value: `${potassium} mg/kg`,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box m="20px">
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                // height: "1em",
                marginRight: "0.5em",
              }}
            >
              <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
            </span>
            Temperature
          </h1>
          {tempLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {temp} °C
            </Typography>
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
              <FontAwesomeIcon icon={faDroplet} />
            </span>
            Humidity
          </h1>
          {humidLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {humid} %
            </Typography>
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
            </span>
            pH
          </h1>
          {phLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {ph}
            </Typography>
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
            </span>
            Conductivity
          </h1>
          {conductLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {conduct}
            </Typography>
          )}
        </Box>
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
            </span>
            Nitrogen
          </h1>
          {nitrogenLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {nitrogen} mg/kg
            </Typography>
          )}
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
            </span>
            Phosphorus
          </h1>
          {phosphorusLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {phosphorus} mg/kg
            </Typography>
          )}
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
            </span>
            Potassium
          </h1>
          {potassiumLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {potassium} mg/kg
            </Typography>
          )}
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Line chart
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Last 12hrs
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{
                    fontSize: "26px",
                    color: colors.greenAccent[500],
                  }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Logs
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setLogs([]);
              }}
            >
              Clear Logs
            </Button>
          </Box>
          {logs.map((log, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box
                sx={{
                  width: "30%",
                }}
              >
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {log.title}
                </Typography>
              </Box>
              <div></div>
              <Box
                color={colors.grey[100]}
                sx={{
                  width: "30%",
                }}
              >
                {log.time}
              </Box>
              <Box
                sx={{
                  width: "40%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                  width="fit-content"
                >
                  {log.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          flexGrow={1}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            {/* <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                AI Result
              </Typography>
              {aiLoading ? (
                <CircularProgress
                  sx={{
                    marginBottom: 2,
                  }}
                  color="secondary"
                  size={24}
                />
              ) : (
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  {ai}
                </Typography>
              )}
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
