import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSetType } from "@/types/privateApi/set";
import { Accordion, AccordionSummary, List } from "@mui/material";
import { WorkoutSet as WorkoutSet } from "./WorkoutSet";
import { ExpandMore } from "@mui/icons-material";
import styles from "@/styles/workoutDay.module.css";
import { Weekday } from "./Weekday";

export const WorkoutDay = ({ day }: { day: Day }) => {
  const { data: workoutSet } = useSWR<PaginatedResponse<WorkoutSetType>>(
    `/set?exerciseday=${day.id}`,
    useAuthFetcher(),
  );
  console.log(day);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`workout-day-${day.id}-content`}
        id={`workout-day-${day.id}-header`}
      >
        <div>
          <h4>{day.description}</h4>
          <span className={styles.weekdays}>
            {day.day.map((weekday, index) => (
              <Weekday
                key={`workoutDay-${day.id}-weekday-${weekday}`}
                weekday={weekday}
                isLast={index + 1 >= day.day.length}
              />
            ))}
          </span>
        </div>
      </AccordionSummary>
      <List>
        {workoutSet?.results.map((set) => (
          <WorkoutSet key={`day-${day.id}-set-${set.id}`} set={set} />
        ))}
      </List>
    </Accordion>
  );
};
