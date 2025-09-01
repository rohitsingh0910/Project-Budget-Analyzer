//document.addEventListener("DOMContentLoaded", () => {
//  const suggestionData = {
//    industry: ["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Retail"],
//    organisation: ["Startup", "SME", "Enterprise", "Government", "Non-Profit"],
//    architecture: ["Monolithic", "Microservices", "Layered", "Event-Driven", "Serverless"],
//    client_server: ["Yes", "No"],
//    application_group: ["ERP", "CRM", "E-commerce", "Mobile", "Web"],
//    application_type: ["Custom", "Package", "Hybrid"],
//    development_platform: ["Java", "Python", "Node.js", ".NET", "PHP"],
//    business_area: ["Sales", "Finance", "HR", "Operations", "IT"],
//    language_type: ["Compiled", "Interpreted", "Scripting"],
//    development_type: ["New Development", "Enhancement", "Maintenance"],
//    used_method: ["Scrum", "Kanban", "Waterfall", "Spiral"],
//    dev_methodologies: ["Agile", "XP", "Lean", "RAD"],
//    dev_techniques: ["OOP", "Functional", "Procedural"],
//    package_customisation: ["Low", "Medium", "High"],
//    degree_customisation: ["Minimal", "Moderate", "Extensive"],
//    team_size_group: ["Small", "Medium", "Large"],
//    web_dev: ["Frontend", "Backend", "Fullstack"],
//    agile_method: ["Scrum", "Kanban", "SAFe", "LeSS"],
//    uncollected_effort: ["0%", "10%", "20%", "30%"]
//  };
//
//  function setupAutocomplete(input, suggestions) {
//    let listContainer;
//
//    input.addEventListener("input", function () {
//      const value = this.value.trim();
//      if (value.length < 3) {
//        if (listContainer) listContainer.remove();
//        return;
//      }
//
//      const filtered = suggestions.filter(item =>
//        item.toLowerCase().includes(value.toLowerCase())
//      );
//
//      if (!filtered.length) {
//        if (listContainer) listContainer.remove();
//        return;
//      }
//
//      if (listContainer) listContainer.remove();
//      listContainer = document.createElement("div");
//      listContainer.classList.add("autocomplete-list");
//
//      filtered.forEach(suggestion => {
//        const item = document.createElement("div");
//        item.classList.add("autocomplete-item");
//        item.textContent = suggestion;
//        item.addEventListener("click", () => {
//          input.value = suggestion;
//          listContainer.remove();
//        });
//        listContainer.appendChild(item);
//      });
//
//      input.parentNode.appendChild(listContainer);
//    });
//
//    document.addEventListener("click", (e) => {
//      if (listContainer && !listContainer.contains(e.target) && e.target !== input) {
//        listContainer.remove();
//      }
//    });
//  }
//
//  // Attach autocomplete to all matching fields
//  for (let key in suggestionData) {
//    const field = document.querySelector(`input[name="${key}"]`);
//    if (field) {
//      setupAutocomplete(field, suggestionData[key]);
//    }
//  }
//});

// Vanilla JS autocomplete with ARIA combobox semantics (listbox popup)
// Shows suggestions when user types >= 3 characters.
// Keyboard: ↑/↓ to move, Enter to select, Esc to close.
// Ref: WAI-ARIA combobox pattern (editable list) & MDN guidance.
/* Docs:
   - https://www.w3.org/WAI/ARIA/apg/patterns/combobox/           (pattern)
   - https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/ (example)
   - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist (limitations)
*/

(function () {
  const MIN_CHARS = 3;

  // ---- RAW OPTION LISTS (exactly as you provided) ---------------------------
  // We keep them as comma-separated strings to include everything without missing any.
  // NOTE: we intentionally preserve duplicates and spelling as-is.

  const lists = {
    dev_methodologies: `
Waterfall (includes Linear Processing), Multifunctional Teams, Waterfall (incl Linear Processing & SSADM), Joint Application Development (JAD), Rapid Application Development (RAD), Timeboxing, Incremental, Agile Development, Spiral, Iterative, Unified Process, Personal Software Process (PSP), Scrum, Lean, OCE, Interactive, Extreme Programming (XP), IT Unified Process (ITUP)
    `,
    business_area: `
Sales, Don't Know, Engineering, Financial (excluding Banking), Outbound Logistics, Insurance, Product, Process & Design, Banking, Accounting, Telecommunications, Inventory, After Sales & Services, Inbound Logistics, Distribution & Transport, Energy (Oil & Petrol/Electricity/Gas/Water/Mining), Sale, Manufacturing, Actuarial System - calculate employer rates, General, Marketing, Personnel, Logistics, Customer Configuration Management, Dealer Operations, Quality, Provide computer services and IT consultation, Human Resources, Legal, Human Ressources, Customs, Government, Sells & after sells, Ocean Transportation, Mutual Funds Insurance, Communications, Social Services, Mail house service, Financial (excluding Banking), Accounting, Customer Relationship, Research & Development, EPOS, Activity Tracking, Registration, racing, Loans, Pension Funds Management, Software house / services, Public Health & Family Services, Defence, Maintain info&sales for Companies in pay save plan, Actuarial, Media, Traffic/Transport, Government, Public Administration (Revenue), All-purpose, Network card administration, Testing, Government National, Personnel, Manufacturing, Purchasing & Supplier Relationship, Claims Processing - Product pays claim, Sales & Marketing, Logistic (Wholesale & Retail/Storage), Valuation, Product, Process &, Generate & Distribute Electricity, Purchasing, Regulatory hazardous waste movement monitoring, Parking, group as Sales & Marketing, Distribution/Scheduling, Fine Enforcement, Financial (Banking, Insurance, Stock), Universal, Social Security, Service, Document registration, Service Management, Public Administration, Government, Public Administration (Revenue), Medical and Health Care, Case Management, Provide computer systems and IT Consultation, Providing IT Companies diff. clients and vice versa, Network Management, Regulation, Postal System, Energy Sources (Oil & Petroleum/Electricity/Gas/Water/Mining), Personnel, Education, Communications, Financial (Banking, Insurance, Stock), Traffic (Aerospace/Railway/Automotive), Transport, hardware/software/services provider, Matching jobs with workers (Job Seekers), Dispute Resolution, Energy generation, Personnel, Banking, Licensing, Regulatory/contaminated site management, Library Management, Systems Integration, Product Distribution, Communications, Manufacturing, Telecommunications network manager, Organizational reporting, hardware/software/service supplier, Contract Management, Medical/Health Care, Network management, Health insurance, Financial (excluding Banking), Property valuation, Chartered flight operation, Manufacturing, Energy Sources (Oil & Petroleum/Electricity/Gas/Water/Mining), Personnel, Health, Safety & Environment, Banking, Financial (Banking, Insurance, Stock), Blood Bank, Project management & job control, Mining Production Information, Inventory, Procurement, Regulatory agency, Parts, Financial (excluding Banking), Property Valuation, Registration, racing administration, Transport, Cost control, Traffic (Aerospace/railway/Automotive), Transport, Architectural, Hardware/software/services provider, Banking Software, Financial (excluding Banking), Personnel, Sales & Distribution, Transport/Shipping, Driving submarine, All Financial Services, Banking s/w, Logistic (Wholesale & Retail/Storage), Government, Financial (excl Banking) & Banking, Communications, Government, Public Administration (Revenue), Post, Traffic (Aerospace/railway/Automotive), Transport, Energy Sources (Oil & Petroleum/Electricity/Gas/Water/Mining), Administration, IS, Environment
    `,
    package_customisation: `No, Don't Know, Yes, People Soft, TIBCO`,
    team_size_group: `5-8, 101+,81-90,21-30,3-4,2,9-14,1,51-60,15-20,31-40,41-50,61-70,71-80,91-100`,
    client_server: `Yes, No, Dont Know, Not Applicable`,
    architecture: `stand alone, client server, multi-tier, multi-tier with web interface, multi-tier/client server`,
    application_group: `Business Application, Mathematically Intensive Application, Infrastructure Software, Real-Time application`,
    used_methodology: `No, Don't Know, Yes, Almost`,
    application_type: `
Transaction/Production System, Stock control & order processing, Billing, Management Information System, Sales contact management, Financial transaction process/accounting, not recorded, Linguistic Software, Trading, Voice Provisioning, Customer billing/relationship management, Data Warehouse system, Office Information System, Client Server, Cars selling, Financial application area, Electronic Data Interchange, Computing of the thermodynamic process, Customer relationship management, MS Billing, Catalogue/register of things or events, Document management, Online analysis and reporting, Workflow support & management, Complex process control, Job, case, incident, project management, Management of Licences and Permits, Government, eSales, Warranty Management, Surveillance and security, Telecom & network management, Manufacturing process management, Military, Web-based Application, Sales promotion tool, Relatively complex application, Company hierarchy and staff directory, Logistic indicators, Real-time System, Fixed asset, Parts selling, Factory parts follow up, Cars documentation, Executive Information System, Decision Support System, After sales Parts documentation, Stock factory management, Operating system or software utility, Production management system, Software for machine control, Track test management, Embedded system/real-time application, Extranet application, Geometric design, Reporting, Integration, Business, Supporting of the commercial network, Personnel system, Management and follow up of the parts, Utility, Service Order & Activation Management, Network Switch Provisioning, Printing Documentation Design, Customs Informations management, Network Management, Migration tool, Dynamic calculation accessory drive and distribution, Fault Tolerance, MS Business Platform, Diagnostic tools, Communication system, Part management in factory, Capacity management, Airport Weather Observation Systems, Meteorological events detection, GUI for Protocol, Inventory gathering and Managing, Embedded Systems, IT project Management, Customer management, Enterprise Management, Management of registration number, MiddleWare, Quality of factory, Geographic or spatial information system, Training Management, Protocols, Customisation (Add-ons) to a Product Data Management System, Knowledge Based Multimedia, IdM, Car Database for factory, Factory follow up, Design management, Msg.Switch/cel phone, Team Management, After Sales Management Contract service, Inventory Management, Vehicle Systems Software, Logistic or supply planning & control, Personal productivity (e.g. spreadsheet), Call Center Management, Commercial Web site, E-Business, Distribution, Office Automation System, Qualty Factory Reporting, GUI Interface Application, Telecommunications, Idea/Patent Information System, Healthcare, Building Automation, Instant Messaging client, Mobile Application, Process Control, Automated Customer Statements, Internal Telecom Ordering Application, Mission-critical system, Ordering tool enhancements for telecom components, Parts Selling website, Mixed, Client/Server Customer Service application, IP Contact Centers, Order Processing System, Electronic Banking, Software development tool, Telecom Data Circuits, DB Search system, Sensor Control + presentation, Business, Catalogue/register of things or events, Products management, Computer Integrated Manufacturing system, Factory's process management, Spare parts management, Contract management After Sales, Parts catalogue management, Interface, System Software, Network Management, After sales parts contract management, Cost analysis, Quality Management, Image, video or sound processing, Central cmd./ctl of sensors, Maintenance, Car Design, GEO Information Management, Salaries Reporting, Graphics & publishing tools or system, Reconciliation, Processing application for public subsidies, Auditing Management, Mathematical modelling (finance or eng.), Content management system, Dynamic website, Calculation, quotation, insurance policy issue, CRM, Factory change programming, Robot, Website, Quality of purchasing, Follow up of car failure, Legislation and consideration of building cases, IT management, Reusable component, Transaction/Production System, EDI front-end for order processing system, Providing Management, Web-based App. DOTNet, Dealer network management, Trading, Personal productivity (e.g. spreadsheet), Marketing Info System, Scheduling of work orders assembly lines, Insurance quotation, Technical Support Information System, International, Sales statistics, Sales calculation (DRP), Simulator, Access Control, Automate exchange between two IT Systems, Client Server and Mainframe, Datawarehouse/ Business Intelligence, Administrative Support System, Clinical Archive, Ordering & provisioning system, Suppliers Management, Production process documentation, Algorithmic + DB, Marketing management, Workplace Savings, Stock factory management, Insurance annuities, Handling payment of social pensions in government, Course management system, Workflow support & management, Quality management, Project management, Cost Tools Computing, Car embedded Computer Management, Pollution statistics, Web-based application, Central database, Parts reporting IS, Monitoring of the factoring process, eCommerce, Data protection, Post exchange, Virtual Synthesis for Acoustic, Stock Management, Promotions, Billing management - Batch processing, Network management, Calculation and quotation of casualty insurance, Provider management, Motor simulator, Database Parts, CIS, Cost logistic Computing, Follow up of the production in factories, Packaged software, Reporting on factoring process, MiddleWare Telecom Switching, Retailler sells follow up, Process of factory management, Performance monitoring, Security management, Equipment Management, Interface database, IT cost project management, Artificial Intelligence based engine, Transportation, Pay, Project Management, European homologation management, Analysis and Environmental Risk Assessment, Online System for University fraternities, Human resources organisation in the factories, Case management, Simulation of the behaviour of vehicles on the road, Cost Computing, Security, Automated Data Acquisition, Management of selling conditions to society, Retailer sales reporting, Fault Management, DSP, Video Game, Administrative system for daycare, Analysis Management, Web Content, Health Management, Executive Information System, Fault Tolerance, Synchronization of Outlook and Application, Ordering, Telecom, Selling reporting, Immobility & Facilities Management, Car electronic design, Marketing systems, Web Content & Middleware, Resources Management, Strategic planning, Telecom Data Circuits and Revenue, Protocol in Building automation, Exchange system, Process management, Functional Specification System, Infrastructure, Internet Banking for personal customers, Sales and Logistics Standard Application, Customer Management, Sales, Customer billing, e-commerce, Parts logistic management, Document management, Trading, Management of customs activities, Security, Automated Data Acquisition, Stock Management, Retailer sales reporting
    `,
    primary_language: `
Oracle, Access, COBOL, Java, Visual Basic, ADS/Online, C, ColdFusion, C#, PL/I, Shell, SQL, PowerBuilder, ABAP, COOL:Gen, MATLAB, PL/SQL, EASYTRIEVE, TELON, C++, Spreadsheet, .Net, Visual C++, DELPHI, Unix Shell, IDEAL, ASP, ASP.Net, RPG, JavaScript, Lotus Notes, PHP, HTML, Script Language, SLOGAN, TIBCO, UNIFACE, Smalltalk, CLIPPER, ASAP, PASCAL, Pro*C, NATURAL, REXX, Centura, FOCUS, Assembler, ABF, VisualAge, HLL/WB, CSP, MANTIS, BPM, IEF, TNSDL, SAS, iOS, HPS, Periproducer, Perl, PowerPlay, Ada, BASIC, STAFFWARE, APPS, IIS, Visual Studio .Net, C/AL, Proprietary Agile Platform, Adobe Flex, Jam, Shell, C, EJB, OutlookVBA, FORTRAN, Object oriented language, PERIPHONICS, Upfront, Datastage, INGRES, Data base language, Siebel, AppBuilder, CICS, Informatica PowerCenter, SAPIENS, RALLY, Pega Workflows, LISP, Unix, J2EE, Caa, PYTHON, Brightware proprietary, LEX, ARBOR/BP, Magic, RPL, COGNOS, ACCEL, MAPPER, IBM WTX, BEA Weblogic, Enablon, MS-Navision Properitory Language, Must Modeller, XML, DRIFT, gcc, Express, AB INITIO, SLEL, iPlanet Netscape Application Server, XGML, A:G, ADO.Net, BO, Huron/Object Star, NCR teradata scripting, Jdeveloper, Visual FoxPro
    `,
    development_platform: `MR, Multi, MF, PC, Proprietary, Hand Held`,
    industry_sector: `Service Industry, Construction, Wholesale & Retail, nan, Insurance, Banking, Medical & Health Care, Electronics & Computers, Communication, Professional Services, Manufacturing, Financial, Government, Utilities, Mining, Education, Defence, Logistics`,
    organisation_type: `
Recreation & Personnel Services, Construction, Billing, nan, Wholesale & Retail Trade, Insurance, Banking, Medical and Health Care, Engineering, Research & Development, Software Development, Client/Server architecture for Language Services, Telecommunication, Ordering, Sales & Marketing, Manufacturing, Voice Provisioning, Government, Community Services, Financial, Property & Business Services, Telecommunications, Computers & Software, Public Administration, Community Services, Insurance, Manufacturing, Transport & Storage, Communications, Electricity, Gas, Water, Government, Education Institution, Wholesale & Retail Trade, Transport & Storage, Communications, Medical and Health Care, Banking, Citizens and the Municipalities, Transport & Storage, Car Rental, Consumer Goods, Public Administration, Insurance, Computers & Software, Consumer Goods, Electronics, Aerospace / Automotive, Public Administration, Media, Government, Defence, Public Administration, Aerospace / Automotive, Computers & Software, Insurance, Electronics, Aerospace / Automotive, Computers & Software, Community Services, Wholesale & Retail Trade, Transport & Storage, Communications, Telecom, Software products, Airport, Building Automation, Oil, Service, Education Institution, Research, Post/mail services, Engineering, Tax administration, General, Credit Card Processor, Chemicals, Business Services, E-Business, Agriculture, Forestry, Fishing, Hunting, Transport & Storage, Public Administration, Community Services, Medical and Health Care, Public Administration, Insurance, Defence, Warehouse Management, Defence, Aerospace / Automotive, general public (mobile phone end user), Food Processing, Transport & Storage, Professional Services, Computers and IT business, Financial, Property & Business Services, Banking, Real Estate & Property Services, Computer Systems Consultant, Public Administration, Transit Corporation, Energy, Marketing, Information Technology, Logistics, Agriculture, Forestry, Fishing, Hunting, Manufacturing, Professional Services, Revenue, Construction, Financial, Property & Business Services, Government, Real Estate & Property Services, Transport & Storage, Housing, Government, Public Administration, Maintenance, Government, Danish citizens, Education Institution, Electricity, Gas, Water, IEEE, All-purpose, Computer Consultants, Occupational Health and Safety, Community Services, Government, Public administration, Education Institution, Manufacturing, Professional Services, Local, Wholesale & Retail Trade, Oil, Communications, Telecom & Networking, Human Resource (HR) Domain, Logistic (Wholesale & Retail/Storage), All industry organization types, Government, Municipal Services, Wholesale & Retail Trade, Financial, Property & Business Services, Government, Local administration and counties, Retail, Government, Financial, Property & Business Services, Manufacturing, Computers, Diversified Corp, Community Services, Municipality, Amusement/Game Center, Government, Public Administration (Revenue), Financial, Publishing, Utilities, IT Services, Government, Electricity, Gas, Water, Communications, Community Services, Professional Services, Electronics, Oil & Petroleum, Professional Services, Computers & Software, Education Institution, Electricity, Gas, Water, University, Communications, Computers & Software, Information Technology Services Provider, Manufacturing, Computers & Software, Internet, Post, Manufacturing, Oil, Medical and Health Care, Professional Services, Government, Professional Services, Aerospace / Automotive, Chemicals, Defence, Electronics, Food Processing, Government, Manufacturing, Medical and Health Care, Mining, Oil & Petroleum, Transport & Storage, Generic application, Agriculture, Forestry, Fishing, Hunting, Air Traffic Management, Restaurant, Surveillance & Security, Government, Medical and Health Care, Community Services, Invoice-handling, Energy Sources (Oil & Petroleum/Electricity etc), Chemicals, Energy, Financial, Property & Business Services, Insurance, Traffic (Aerospace/Railway/Automotive), Transport, Real Estate & Property Services, Community Services, Professional Services, Environmental Consulting, Government, Public administration, Consultancy, Education, Advertising, Government, Real Estate & Property, Service, Recreation, Personnel & Other Services, Data Provisioning, Agriculture, Forestry, Fishing, Hunting, Chemicals, Computers & Software, Construction, Defence, Electricity, Gas, Water, Electronics, Food Processing, Government, generic application, Exhibition Management, Travel, Government, Municipal, Revenue collection, Agriculture, Forestry, Fishing, Hunting, Banking, Government, Public Administration (Revenue), Security, Content Management, Computers & Software, Citizens of DK, Manufacturing, Computers, Diversified corporation, Computers & Software, Human Ressources, Mining, Manufacturing, Wholesale & Retail Trade, Government, Municipality, Chemicals, Community Services, Electricity, Gas, Water, Government, Transport & Storage, Aerospace / Automotive, Virtual Assistants (Lingubots), Public Sector, Transport & Storage, Media, UniversityEvent Management-involves external users, Community Services, Institutions eg. Kindergartens, Agriculture, Forestry, Fishing, Hunting, Government, Distribution, Information Technology, Human Resource (HR) Domain, High Tech, Coronial Services, Financial, Property & Business Services, Banking, Insurance, Stock, Government, Defence, Aerospace / Automotive, Recreation & Personnel Services, Professional Services, Computers & Software, Biotech, Mining, Manufacturing, Chemicals, Commercial services, Sales, Developing global software solutions, Imaging, Research & development, Government, Electricity, Gas, Water, Manufacturing, Consumer Goods, Wholesale & Retail Trade, Consumer Goods, Wholesale & Retail Trade, Computers & Software, Communications, Electronics, Transport & Storage, Public Administration, Communications, Financial, Banking, Insurance, Stock, Government, Public Administration, Revenue, Manufacturing, Medical and Health Care, Post, Traffic, Research & Development, Energy, Services, IS-Metrics collection system, Manufacturing, Manufacture of steel products, Any organization which counts function points, Finance, Government, Real Estate & Property, Education Institution, Manufacturing, Construction, Wholesale & Retail Trade, Transport & Storage, Communications, Medical and Health Care, Community Services, Defence, Financial, Property & Business Services, Banking, Professional, Public Administration, Financial, Property & Business Services, Government, Health Sciences, Environmental Monitoring, Public Administration
    `,
    language_type: `4GL, 3GL, APG,2GL,5GL`,
    relative_size: `XXS,XS,S,M1,M2,L,XL,XXL,XXXL`,
    development_type: `New Development, Enhancement, Re-development, Not Defined, Other, Porting, POC`
  };

  // convert comma-separated strings to arrays and trim
  const options = Object.fromEntries(
    Object.entries(lists).map(([k, v]) => [
      k,
      v.split(",").map(s => s.trim()).filter(Boolean)
    ])
  );

  // ---- Autocomplete implementation -----------------------------------------
  function createListContainer(input) {
    const list = document.createElement("div");
    list.className = "autocomplete-list";
    list.setAttribute("role", "listbox");
    list.id = `${input.name || input.dataset.list}-listbox-${Math.random().toString(36).slice(2,7)}`;
    return list;
  }

  function renderSuggestions(input, list, items, query) {
    list.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "autocomplete-empty";
      empty.textContent = `No matches for "${query}"`;
      list.appendChild(empty);
      return;
    }

    items.forEach((text, idx) => {
      const div = document.createElement("div");
      div.className = "autocomplete-item";
      div.setAttribute("role", "option");
      div.setAttribute("id", `${list.id}-opt-${idx}`);
      div.textContent = text;
      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        commitValue(input, list, text);
      });
      list.appendChild(div);
    });
  }

  function commitValue(input, list, value) {
    input.value = value;
    input.setAttribute("aria-activedescendant", "");
    hideList(list);
  }

  function showList(input, list) {
    if (!list.parentNode) input.parentNode.appendChild(list);
    list.style.display = "block";
    input.setAttribute("aria-controls", list.id);
    input.setAttribute("aria-expanded", "true");
  }

  function hideList(list) {
    if (list) {
      list.style.display = "none";
      const input = list.previousElementSibling?.tagName === "INPUT"
        ? list.previousElementSibling
        : list.parentNode?.querySelector("input");
      if (input) input.setAttribute("aria-expanded", "false");
    }
  }

  function moveActive(list, dir) {
    const items = Array.from(list.querySelectorAll(".autocomplete-item"));
    if (!items.length) return null;
    let index = items.findIndex(el => el.getAttribute("aria-selected") === "true");
    index = (index + dir + items.length) % items.length;
    items.forEach(el => el.setAttribute("aria-selected", "false"));
    const active = items[index];
    active.setAttribute("aria-selected", "true");
    active.scrollIntoView({ block: "nearest" });
    return active;
  }

  function setupAutocomplete(input, data) {
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");

    const list = createListContainer(input);

    let lastQuery = "";
    let debounce;
    input.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = input.value.trim();
        if (q.length < MIN_CHARS) { hideList(list); return; }
        if (q === lastQuery && list.style.display === "block") return;
        lastQuery = q;

        const filtered = data.filter(opt =>
          opt.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 200); // hard cap for performance

        renderSuggestions(input, list, filtered, q);
        showList(input, list);
      }, 80);
    });

    input.addEventListener("keydown", (e) => {
      const visible = list.style.display !== "none" && list.parentNode;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        showList(input, list);
        const active = moveActive(list, +1);
        if (active) input.setAttribute("aria-activedescendant", active.id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        showList(input, list);
        const active = moveActive(list, -1);
        if (active) input.setAttribute("aria-activedescendant", active.id);
      } else if (e.key === "Enter" && visible) {
        const active = list.querySelector('.autocomplete-item[aria-selected="true"]');
        if (active) {
          e.preventDefault();
          commitValue(input, list, active.textContent);
        }
      } else if (e.key === "Escape" && visible) {
        e.preventDefault();
        hideList(list);
      }
    });

    document.addEventListener("click", (evt) => {
      if (!list.contains(evt.target) && evt.target !== input) hideList(list);
    });
  }

  // Bind all inputs with data-list
  document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll('input.autocomplete[data-list]');
    inputs.forEach((inp) => {
      const key = inp.dataset.list;
      const dataset = options[key] || [];
      setupAutocomplete(inp, dataset);
    });
  });
})();
