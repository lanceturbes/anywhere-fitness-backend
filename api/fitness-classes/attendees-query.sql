
 SELECT cl.class_id AS class_id,
        COUNT(cl.class_id) AS attendees
   FROM classes AS cl
        LEFT JOIN classes_clients AS c_c
        ON cl.class_id = c_c.class_id
  GROUP BY cl.class_id
  ORDER BY cl.class_id;
