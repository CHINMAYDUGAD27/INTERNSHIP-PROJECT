--
-- PostgreSQL database dump
--

\restrict c9Fw65bbLdQzIpQbD0D00TNTyqbOhVDiqXaxvCZgRWrR5bIEv2A93NmpoNb32U3

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: accommodation; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.accommodation VALUES (4, 'Priya Ramesh Agarwal', '9823012345', 'Tent Colony A, Ramkund', '2027-08-14', '2027-08-17', 'TKN-4401', 'Sinhasta – 06:00–08:00', 'Checked In');
INSERT INTO public.accommodation VALUES (5, 'Mohan Das Tripathi', '9765432100', 'Dharamshala B, Panchavati', '2027-08-15', '2027-08-20', 'TKN-4402', 'Sinhasta – 08:00–10:00', 'Checked In');
INSERT INTO public.accommodation VALUES (6, 'Kavita Suresh Mishra', '9911223344', 'Tent Colony C, Tapovan', '2027-08-17', '2027-08-22', 'TKN-4403', 'Sinhasta – 10:00–12:00', 'Waiting');
INSERT INTO public.accommodation VALUES (7, 'Balaram Venkat Iyer', '9876500001', 'Bhakta Niwas, Nashik Road', '2027-08-18', '2027-08-21', 'TKN-4404', 'Sinhasta – 14:00–16:00', 'Checked In');
INSERT INTO public.accommodation VALUES (8, 'Geeta Arvind Sharma', '9820099887', 'Tent Colony A, Ramkund', '2027-08-20', '2027-08-23', 'TKN-4405', 'Sinhasta – 06:00–08:00', 'Waiting');
INSERT INTO public.accommodation VALUES (9, 'Suresh Narayan Pandey', '9988776655', 'Bhakta Niwas, Trimbakeshwar', '2027-08-22', '2027-08-25', 'TKN-4406', 'Sinhasta – 16:00–18:00', 'Waiting');
INSERT INTO public.accommodation VALUES (10, 'Anjali Deepak Joshi', '9765011234', 'Tent Colony B, Panchavati', '2027-08-25', '2027-08-28', 'TKN-4407', 'Sinhasta – 08:00–10:00', 'Checked Out');
INSERT INTO public.accommodation VALUES (11, 'Rajan Bholanath Tiwari', '9444556677', 'Dharamshala A, Tapovan', '2027-08-28', '2027-09-02', 'TKN-4408', 'Sinhasta – 12:00–14:00', 'Waiting');


--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.budgets VALUES (1, 'Public Works Department', 500000000, 120000000, 380000000, '2026-27', 'Road widening and bridge construction');
INSERT INTO public.budgets VALUES (2, 'Health Department', 200000000, 45000000, 155000000, '2027-2028', 'Active');
INSERT INTO public.budgets VALUES (3, 'Police Department', 300000000, 90000000, 210000000, '2027-2028', 'Active');


--
-- Data for Name: cleanliness; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cleanliness VALUES (4, 'Zone A', 'Ramkund Ghat', 'Clean', 78.5, 7.2, 6.8, '2027-08-15', 'Pre-Sinhasta deep cleaning completed');
INSERT INTO public.cleanliness VALUES (5, 'Zone B', 'Panchvati Ghat', 'Moderate', 62.1, 7.6, 5.9, '2027-08-15', 'Idol immersion residue — cleanup in progress');
INSERT INTO public.cleanliness VALUES (6, 'Zone C', 'Tapovan Ghat', 'Clean', 82.3, 7, 7.4, '2027-08-17', 'Satisfactory — daily inspection passed');
INSERT INTO public.cleanliness VALUES (7, 'Zone D', 'Kapileshwar Ghat', 'Poor', 44.6, 8.1, 4.2, '2027-08-19', 'High faecal coliform detected — advisory issued');
INSERT INTO public.cleanliness VALUES (8, 'Zone E', 'Ahilya Devi Ghat', 'Moderate', 65.8, 7.4, 6.1, '2027-08-21', 'Overflow from temporary toilets — repair underway');
INSERT INTO public.cleanliness VALUES (9, 'Zone F', 'Godavari Sangam Ghat', 'Clean', 74.2, 7.1, 7, '2027-08-24', 'Post-Sinhasta snan — normal levels restored');
INSERT INTO public.cleanliness VALUES (10, 'Zone G', 'Saptashrungi Approach', 'Moderate', 59, 7.8, 5.5, '2027-08-29', 'Monsoon runoff affecting WQI — monitoring daily');


--
-- Data for Name: crowd; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.crowd VALUES (20, '2027-08-15', 'Ramkund Ghat', 850000, 920000, 'High');
INSERT INTO public.crowd VALUES (21, '2027-08-15', 'Trimbakeshwar Temple', 600000, 580000, 'Medium');
INSERT INTO public.crowd VALUES (22, '2027-08-17', 'Panchavati', 400000, 435000, 'High');
INSERT INTO public.crowd VALUES (23, '2027-08-19', 'Tapovan Ghat', 300000, 270000, 'Low');
INSERT INTO public.crowd VALUES (24, '2027-08-21', 'Saptashrungi Road', 500000, 550000, 'Medium');
INSERT INTO public.crowd VALUES (25, '2027-08-24', 'Nashik Road Junction', 750000, 710000, 'Medium');
INSERT INTO public.crowd VALUES (26, '2027-08-29', 'Godavari Sangam Point', 1200000, 1380000, 'High');
INSERT INTO public.crowd VALUES (27, '2027-09-03', 'Mukti Dham Area', 320000, 295000, 'Low');


--
-- Data for Name: dashboard; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dashboard VALUES (1, 125, 48, 77, 250000000, 95000000, 12000000, 18000, 240, 320, 850, 50000);


--
-- Data for Name: land_acquisition; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.land_acquisition VALUES (4, 'PCL-2701', 'Ramesh Shankar Patil', 12500, 'Survey No. 45, Ramkund, Nashik', 'Camps', 'Acquired', 3750000, '2027-06-12');
INSERT INTO public.land_acquisition VALUES (5, 'PCL-2702', 'Sunita Vijay Joshi', 8400, 'Survey No. 12, Trimbak Road, Nashik', 'Roads', 'Acquired', 2100000, '2027-05-28');
INSERT INTO public.land_acquisition VALUES (6, 'PCL-2703', 'Prakash Narayan Deshmukh', 5200, 'Gat No. 88, Panchavati', 'Parking', 'Acquired', 1560000, '2027-07-03');
INSERT INTO public.land_acquisition VALUES (7, 'PCL-2704', 'Mangala Bapu Shinde', 9800, 'Survey No. 67, Tapovan, Nashik', 'Infrastructure', 'Pending', 2940000, NULL);
INSERT INTO public.land_acquisition VALUES (8, 'PCL-2705', 'Yogesh Mahadev Kulkarni', 6700, 'CTS No. 201, Nashik Road', 'Camps', 'Acquired', 2010000, '2027-07-15');
INSERT INTO public.land_acquisition VALUES (9, 'PCL-2706', 'Vandana Suresh Wagh', 4300, 'Survey No. 33, Godavari Nagar', 'Roads', 'On Hold', 1290000, NULL);
INSERT INTO public.land_acquisition VALUES (10, 'PCL-2707', 'Dinkar Bhau Pawar', 11000, 'Gat No. 102, Saptashrungi Corridor', 'Camps', 'Acquired', 3300000, '2027-06-30');
INSERT INTO public.land_acquisition VALUES (11, 'PCL-2708', 'Rekha Vitthal Bhosale', 3100, 'Survey No. 77, Mukti Dham Road', 'Parking', 'Rejected', 930000, NULL);


--
-- Data for Name: medical_data; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.medical_data VALUES (11, 'Zone A – Ramkund', 'Civil Hospital Nashik', 28, 55, 14, 800, 912, 'High');
INSERT INTO public.medical_data VALUES (12, 'Zone B – Trimbakeshwar', 'Trimbakeshwar Field Camp', 12, 22, 6, 400, 387, 'Normal');
INSERT INTO public.medical_data VALUES (13, 'Zone C – Panchavati', 'Panchavati PHC', 8, 18, 4, 350, 402, 'High');
INSERT INTO public.medical_data VALUES (14, 'Zone D – Tapovan', 'Tapovan Medical Outpost', 6, 12, 2, 200, 190, 'Normal');
INSERT INTO public.medical_data VALUES (15, 'Zone E – Nashik Road', 'Apollo Clinic (Kumbh Branch)', 15, 28, 8, 600, 631, 'Critical');
INSERT INTO public.medical_data VALUES (16, 'Zone F – Godavari Nagar', 'Godavari Nagar Trauma Center', 20, 38, 10, 500, 478, 'Normal');
INSERT INTO public.medical_data VALUES (17, 'Zone G – Saptashrungi', 'Saptashrungi Mobile Medical Unit', 5, 10, 0, 150, 178, 'High');


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.projects VALUES (1, 'Road Widening - Nashik to Trimbakeshwar', 'PWD', 'Nashik', 150000000, 35, 'Ongoing', '2026-07-01', '2027-03-31', 'Road widening project for Simhastha Kumbh.');


--
-- Data for Name: sadhu_gram; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sadhu_gram VALUES (4, 'Shri Niranjani Akhara', 'Zone A', 'NRA-01', 18000, 5000, 4820, 'Active');
INSERT INTO public.sadhu_gram VALUES (5, 'Shri Juna Akhara', 'Zone B', 'JNA-01', 22000, 7000, 6750, 'Active');
INSERT INTO public.sadhu_gram VALUES (6, 'Shri Mahanirvani Akhara', 'Zone A', 'MNA-01', 15000, 4500, 4480, 'Active');
INSERT INTO public.sadhu_gram VALUES (7, 'Atal Akhara', 'Zone C', 'ATA-01', 10000, 3000, 2900, 'Active');
INSERT INTO public.sadhu_gram VALUES (8, 'Shri Panchagni Akhara', 'Zone D', 'PGA-01', 8000, 2500, 1800, 'Active');
INSERT INTO public.sadhu_gram VALUES (9, 'Shri Awahan Akhara', 'Zone B', 'AWA-01', 9500, 2800, 2650, 'Active');
INSERT INTO public.sadhu_gram VALUES (10, 'Namo Narayan Akhara', 'Zone E', 'NNA-01', 6000, 1800, 0, 'Inactive');


--
-- Data for Name: safety; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.safety VALUES (4, 'Ramkund Main Gate', 'Zone A', 85, 'Active', 'Open', 'High', '2027-08-15', 'Stampede alert — extra forces deployed');
INSERT INTO public.safety VALUES (5, 'Trimbak Road Checkpoint', 'Zone B', 60, 'Active', 'Open', 'Medium', '2027-08-15', 'Smooth flow — VIP convoy passing at 14:00');
INSERT INTO public.safety VALUES (8, 'Nashik Road Toll Naka', 'Zone E', 72, 'Active', 'Open', 'Medium', '2027-08-21', 'Night shift reinforcement active');
INSERT INTO public.safety VALUES (9, 'Godavari Nagar Entry', 'Zone F', 50, 'Inactive', 'Closed', 'Low', '2027-08-19', 'Barricading equipment delayed — awaiting EOD');
INSERT INTO public.safety VALUES (10, 'Saptashrungi Path Gate', 'Zone G', 38, 'Active', 'Open', 'Medium', '2027-08-24', 'Pilgrim flow stable — religious procession expected');
INSERT INTO public.safety VALUES (11, 'Mukti Dham Perimeter', 'Zone H', 20, 'Inactive', 'Closed', 'Low', '2027-08-15', 'Low footfall — 2 officers on leave');
INSERT INTO public.safety VALUES (6, 'Panchavati Crossing', 'Zone C', 45, 'Partial', 'Closed', 'High', '2026-08-12', 'Barricade repair underway');
INSERT INTO public.safety VALUES (7, 'Tapovan Bridge Entry', 'Zone D', 30, 'Active', 'Open', 'Low', '2026-08-12', 'Gate closed for structural inspection');


--
-- Data for Name: traffic_data; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.traffic_data VALUES (1, 'Ramkund', 'Panchavati Road', 4500, 8, 'Normal', 'Shahi Snan');
INSERT INTO public.traffic_data VALUES (2, 'Trimbakeshwar', 'Trimbak Highway', 1250, 35, 'Sunny', 'Normal');
INSERT INTO public.traffic_data VALUES (3, 'Panchavati Ghat', 'Godavari Bypass Road', 1250, 35, 'Sunny', 'Normal');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'Chinmay Dugad', 'chinmay@gmail.com', '$2b$12$u4HcDWdC1MHXWdB.hsW63ux0AM8WZ0zJEGrJz5/WOf7GpSi6UU.bS', 'Administrator', 'IT', '9876543210', '2026-07-22 22:41:53.495325+05:30');
INSERT INTO public.users VALUES (2, 'CHINMAY DUGAD', 'chinmay1@gmail.com', '$2b$12$OQwKWt.JGnpxod6SznpkOOQh5keo1HbEM.70ALmsDUeK8o2cNadai', 'Admin', 'General', '1234567890', '2026-07-23 14:27:51.05668+05:30');
INSERT INTO public.users VALUES (3, 'DEVENDRAKUMAR', 'devendra@gmail.com', '$2b$12$uShB7SfHekbLjJA8Fq8c..9khdxqtYPG/w6bHxKqQqoLZzr.bx9Wy', 'Officer', 'Medical', '3214567890', '2026-07-23 18:15:34.876477+05:30');


--
-- Name: accommodation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accommodation_id_seq', 11, true);


--
-- Name: budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.budgets_id_seq', 3, true);


--
-- Name: cleanliness_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cleanliness_id_seq', 10, true);


--
-- Name: crowd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.crowd_id_seq', 27, true);


--
-- Name: dashboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dashboard_id_seq', 1, true);


--
-- Name: land_acquisition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.land_acquisition_id_seq', 11, true);


--
-- Name: medical_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.medical_data_id_seq', 17, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, true);


--
-- Name: sadhu_gram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sadhu_gram_id_seq', 10, true);


--
-- Name: safety_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.safety_id_seq', 11, true);


--
-- Name: traffic_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.traffic_data_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict c9Fw65bbLdQzIpQbD0D00TNTyqbOhVDiqXaxvCZgRWrR5bIEv2A93NmpoNb32U3

