#!/usr/bin/env bash
set -e

PORT=${PORT:-3000}
BASE_URL="http://localhost:$PORT"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  Running Automated MCD Infinity API Test Suite     ${NC}"
echo -e "${BLUE}  Target: $BASE_URL                                 ${NC}"
echo -e "${BLUE}====================================================${NC}"

test_endpoint() {
  local method=$1
  local path=$2
  local data=$3
  local desc=$4

  echo -n -e "Testing [${YELLOW}$method${NC}] $path ... "

  local status
  if [ "$method" = "GET" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  elif [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$path" \
      -H "Content-Type: application/json" -d "$data")
  fi

  if [[ "$status" =~ ^20[0-9]$ ]]; then
    echo -e "${GREEN}PASS (HTTP $status)${NC} - $desc"
  else
    echo -e "\033[0;31mFAIL (HTTP $status)\033[0m - $desc"
    exit 1
  fi
}

echo -e "\n${BLUE}--- System & Docs Endpoints ---${NC}"
test_endpoint "GET" "/health" "" "Health check"
test_endpoint "GET" "/openapi.json" "" "OpenAPI specification"
test_endpoint "GET" "/docs" "" "Swagger UI documentation"

echo -e "\n${BLUE}--- Physical Persons Endpoints ---${NC}"
test_endpoint "GET" "/persons/physical" "" "Search physical persons"
test_endpoint "GET" "/persons/physical?FirstName=Jonas&CountryCode=LT" "" "Search physical persons with query filter"
test_endpoint "POST" "/persons/physical" '{"firstName":"Mantas","lastName":"Jankauskas","personalCode":"39007070007","countryCode":"LT","email":"m.jankauskas@example.com","emailVerified":true,"phoneNumber":"+37060099887","phoneNumberVerified":true,"selectedProducts":[{"ProductCategory":"ACCOUNTS","ProductId":"STANDARD"}]}' "Create physical prospect"
test_endpoint "GET" "/persons/physical/P1001" "" "Get physical person by MCD ID"
test_endpoint "PUT" "/persons/physical/P1001" '{"PrimaryEmail":"jonas.updated@example.com","PrimaryPhoneNumber":"+37060011223"}' "Update physical person"
test_endpoint "POST" "/persons/physical/P1001/consent" '{"ConsentOffers":true,"ConsentProfiling":true,"ConsentPartnersOffers":true}' "Update physical person consents"
test_endpoint "GET" "/persons/physical/P1003/potentialGuardians" "" "Get potential guardians for junior"
test_endpoint "PUT" "/persons/physical/P1003/guardian/P1001" "" "Set junior guardian"
test_endpoint "GET" "/persons/physical/P1001/children" "" "Get children for guardian"
test_endpoint "PUT" "/persons/physical/P1001/coapplicant/P1002" "" "Set coapplicant relation"

echo -e "\n${BLUE}--- Juridical Persons Endpoints ---${NC}"
test_endpoint "GET" "/persons/juridical" "" "Search juridical persons"
test_endpoint "GET" "/persons/juridical?CompanyCode=305123456" "" "Search juridical person by CompanyCode"
test_endpoint "PUT" "/persons/juridical" '{"juridicalPerson":{"companyCode":"306999888","countryCode":"LT","fullName":"UAB Inovaciju Centras"},"representative":{"firstName":"Tomas","lastName":"Vaitkus","personalCode":"38101010010","countryCode":"LT"}}' "Ensure juridical prospect with representative"
test_endpoint "GET" "/persons/juridical/J2001" "" "Get juridical person"
test_endpoint "PUT" "/persons/juridical/J2001" '{"FullName":"UAB Baltijos Technologijos Group","PrimaryEmail":"contact@baltiantech.lt"}' "Update juridical person"
test_endpoint "POST" "/persons/juridical/J2001/consent" '{"ConsentOffers":true,"ConsentPartnersOffers":true}' "Update juridical consents"
test_endpoint "PUT" "/persons/juridical/accumulated" '{"juridicalPersonDetails":{"fullName":"UAB Ateities Sprendimai","phoneNumber":"+37068811223","secondaryPhoneNumber":"+37052990000","registrationAddress":{"countryCode":"LT","city":"Vilnius","street":"Upės g. 21"},"selectedProducts":[{"ProductCategory":"ACCUMULATED","ProductId":"FOUNDING_CAPITAL"}]},"representativeDetails":{"firstName":"Simas","lastName":"Kairys","personalCode":"39304040004","countryCode":"LT"}}' "Ensure accumulated account with representative"
test_endpoint "GET" "/persons/juridical/accumulated?CompanyName=Naujas" "" "Search accumulated account"
test_endpoint "POST" "/persons/juridical/A4001/transformFromAccumulated" '{"juridicalPersonDetails":{"companyCode":"307111222"},"representativeDetails":{"firstName":"Vytautas","lastName":"Petrauskas","personalCode":"37905050005","countryCode":"LT"}}' "Transform accumulated account to SME"
test_endpoint "GET" "/persons/juridical/J2001/representatives/R3001" "" "Validate representative"

echo -e "\n${BLUE}--- Representatives Endpoints ---${NC}"
test_endpoint "GET" "/persons/representatives" "" "Search representatives"
test_endpoint "GET" "/persons/representatives/R3001" "" "Get representative details"
test_endpoint "PUT" "/persons/representatives/R3001" '{"LanguageCode":"en","PrimaryEmail":"v.petrauskas.updated@example.com"}' "Update representative"

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ALL 21 MCD INFINITY API ENDPOINTS PASSED!         ${NC}"
echo -e "${GREEN}====================================================${NC}"
