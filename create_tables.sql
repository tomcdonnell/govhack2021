CREATE TABLE tax_stats_by_postcode (
  taxStatsByPostcodeID int(10) unsigned NOT NULL AUTO_INCREMENT,
  taxYear varchar(9) NOT NULL,
  stateAbbrev varchar(8) NOT NULL,
  postcode int unsigned DEFAULT NULL,
  nIndividuals int unsigned NOT NULL,
  nIndividualsWithTaxableIncomeOrLoss int unsigned NOT NULL,
  taxableIncomeOrLossDollars int NOT NULL,
  nIndividualsWithTaxOnTaxableIncome int unsigned NOT NULL,
  taxOnTaxableIncomeDollars int unsigned NOT NULL,
  nIndividualsWithNetTax int unsigned NOT NULL,
  netTaxDollars int unsigned NOT NULL,
  nIndividualsWithHelpDebt int unsigned NOT NULL,
  helpDebtDollars int unsigned NOT NULL,
  nIndividualsWithSalaryOrWages int unsigned NOT NULL,
  salaryOrWagesDollars int unsigned NOT NULL,
  nIndividualsWithTaxWithheldFromSalaryOrWages int unsigned NOT NULL,
  taxWithheldFromSalaryOrWagesDollars int unsigned NOT NULL,
  nIndividualsWithAustralianGovernmentAllowancesAndPayments int unsigned NOT NULL,
  australianGovernmentAllowancesAndPaymentsDollars int unsigned NOT NULL,
  nIndividualsWithAustralianGovernmentPensionsAndAllowances int unsigned NOT NULL,
  australianGovernmentPensionsAndAllowancesDollars int unsigned NOT NULL,
  nindividualsWithSuperIncomeTaxed int unsigned NOT NULL,
  superIncomeTaxedDollars int unsigned NOT NULL,
  nIndividualsWithSuperIncomeUntaxed int unsigned NOT NULL,
  superIncomeUntaxedDollars int unsigned NOT NULL,
  nIndividualsWithTotalIncomeOrLoss3 int unsigned NOT NULL,
  totalIncomeOrLoss3Dollars int NOT NULL,
  nIndividualsWithWorkRelatedSelfEducationExpenses int unsigned NOT NULL,
  workRelatedSelfEducationExpensesDollars int unsigned NOT NULL,
  nIndividualsWithGiftsOrDonations int unsigned NOT NULL,
  giftsOrDonationsDollars int unsigned NOT NULL,
  nIndividualsWithTotalDeductions3 int unsigned NOT NULL,
  totalDeductions3Dollars int unsigned NOT NULL,
  nIndividualsWithEmployerSuperannuationContributions int unsigned NOT NULL,
  employerSuperannuationContributionsDollars int unsigned NOT NULL,
  nIndividualsWithGrossRent int unsigned NOT NULL,
  grossRentDollars int unsigned NOT NULL,
  nIndividualsWithNetRentProfit int unsigned NOT NULL,
  netRentProfitDollars int unsigned NOT NULL,
  nIndividualsWithNetRentLoss  int unsigned NOT NULL,
  netRentLossDollars int NOT NULL,
  nIndividualsWithLowAndMiddleIncomeTaxOffset int unsigned NOT NULL,
  lowAndMiddleIncomeTaxOffsetDollars int unsigned NOT NULL,
  nIndividualsWithPrivateHealthInsurance int unsigned NOT NULL,
  nIndividualsWithPrivateHealthInsuranceAustGovRebateReceived int unsigned NOT NULL,
  privateHealthInsuranceAustGovRebateReceivedDollars int unsigned NOT NULL,
  PRIMARY KEY (taxStatsByPostcodeID),
  KEY tax_stats_by_postcode_stateAbbrev (stateAbbrev),
  KEY tax_stats_by_postcode_postcode (postcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE school_leavers_by_state_suburb (
  schoolLeaversByStateSuburbID int(10) unsigned NOT NULL AUTO_INCREMENT,
  vcaaCode varchar(128) NOT NULL,
  schoolName varchar(128) NOT NULL,
  sector varchar(128) NOT NULL,
  suburb varchar(128) NOT NULL,
  nCompletedY12 int unsigned NOT NULL,
  nOnTrackConsenters int unsigned NOT NULL,
  nOnTrackRespondents int unsigned NOT NULL,
  percentInEducationBachelorEnrolled int unsigned NOT NULL,
  percentInEducationDeferred int unsigned NOT NULL,
  percentInEducationTafeOrVetEnrolled int unsigned NOT NULL,
  percentInEducationApprenticeOrTrainee int unsigned NOT NULL,
  percentNotInEducationEmployed int unsigned NOT NULL,
  percentNotInEducationLookingForWork int unsigned NOT NULL,
  percentNotInEducationOther int unsigned NOT NULL,
  PRIMARY KEY (schoolLeaversByStateSuburbID),
  KEY school_leavers_by_postcode_suburb (suburb),
  UNIQUE KEY school_leavers_by_postcode_unique (vcaaCode, schoolName, suburb)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;





UPDATE school_leavers_by_postcode SET nCompletedY12Percentile=ROUND(100 * PERCENT_RANK() OVER (ORDER BY nCompletedY12 ASC));




WITH cte AS (
   SELECT
   schoolLeaversByPostcodeID_PK,
   ROUND(100 * PERCENT_RANK() OVER (ORDER BY nCompletedY12 ASC)) AS nCompletedY12PercentileTemp
   FROM school_leavers_by_postcode
)
UPDATE school_leavers_by_postcode
SET nCompletedY12Percentile=cte.nCompletedY12PercentileTemp
FROM cte
WHERE schoolLeaversByPostcodeID_PK=cte.schoolLeaversByPostcodeID_PK;








CREATE TABLE state_suburb (
  stateSuburbID int(10) unsigned NOT NULL AUTO_INCREMENT,
  countryStateID int(10) unsigned NOT NULL,
  suburbName varchar(128) NOT NULL,
  PRIMARY KEY (stateSuburbID),
  FOREIGN KEY (countryStateID) REFERENCES country_state (countryStateID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO state_suburb (countryStateID, suburbName)
SELECT DISTINCT countryStateID, suburb
FROM postcode_link_suburb
ORDER BY countryStateID ASC, suburb ASC;


CREATE TABLE suburb_link_postcode (
  suburbLinkPostcodeID int(10) unsigned NOT NULL AUTO_INCREMENT,
  stateSuburbID int(10) unsigned NOT NULL,
  postcode int(10) unsigned NOT NULL,
  PRIMARY KEY (suburbLinkPostcodeID),
  FOREIGN KEY (stateSuburbID) REFERENCES state_suburb (stateSuburbID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO suburb_link_postcode (stateSuburbID, postcode)
SELECT DISTINCT stateSuburbID, postcode
FROM postcode_link_suburb
ORDER BY postcode ASC, stateSuburbID ASC;

UPDATE postcode_link_suburb AS pls
SET pls.stateSuburbID=(
   SELECT stateSuburbID
   FROM state_suburb AS ss
   WHERE ss.countryStateID=pls.countryStateID
   AND ss.suburbName=pls.suburb
);

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `countryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`countryID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'Australia'),(2,'New Zealand');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country_state`
--

DROP TABLE IF EXISTS `country_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country_state` (
  `countryStateID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stateName` varchar(32) NOT NULL,
  `countryID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`countryStateID`),
  UNIQUE KEY `countryID` (`countryID`,`stateName`),
  KEY `country_state_countryID` (`countryID`),
  CONSTRAINT `country_state_countryID` FOREIGN KEY (`countryID`) REFERENCES `country` (`countryID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country_state`
--

LOCK TABLES `country_state` WRITE;
/*!40000 ALTER TABLE `country_state` DISABLE KEYS */;
INSERT INTO `country_state` VALUES (1,'',1),(8,'ACT',1),(5,'NSW',1),(3,'NT',1),(6,'QLD',1),(4,'SA',1),(11,'TAS',1),(2,'VIC',1),(7,'WA',1),(10,'',2);
/*!40000 ALTER TABLE `country_state` ENABLE KEYS */;
UNLOCK TABLES;










ALTER TABLE school_leavers_by_state_suburb ADD COLUMN stateSuburbID int(10) unsigned NOT NULL AFTER schoolLeaversByStateSuburbID;

UPDATE school_leavers_by_state_suburb SET stateSuburbID=(
   SELECT stateSuburbID
   FROM state_suburb
   WHERE suburbName=suburb
   AND countryStateID=2
);

ALTER TABLE school_leavers_by_state_suburb ADD FOREIGN KEY (stateSuburbID) REFERENCES state_suburb (stateSuburbID);











INSERT INTO school_leavers_by_state_suburb_copy SELECT * FROM school_leavers_by_state_suburb;

ALTER TABLE school_leavers_by_state_suburb ADD COLUMN percentInEducationBachelorEnrolledPercentile int unsigned NOT NULL AFTER percentInEducationBachelorEnrolled;

UPDATE school_leavers_by_state_suburb SET percentInEducationBachelorEnrolledPercentile=(
   PERCENT_RANK() OVER (
      PARTITION BY school_leavers_by_state_suburb_copy.percentInEducationBachelorEnrolled
      ORDER BY     school_leavers_by_state_suburb_copy.percentInEducationBachelorEnrolled ASC
   )
);

UPDATE school_leavers_by_state_suburb SET percentInEducationBachelorEnrolledPercentile=(
   PERCENT_RANK() OVER (
      PARTITION BY school_leavers_by_state_suburb_copy.percentInEducationBachelorEnrolled
      ORDER BY     school_leavers_by_state_suburb_copy.percentInEducationBachelorEnrolled ASC
   )
);
