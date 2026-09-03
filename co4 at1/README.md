# WEB TECHNOLOGY
## UNIT IV - REPRESENTING WEB DATA
### ASSESSMENT I: DATA INTERPRETATION (CO4-AT1)

**Duration:** 60 Minutes | **Maximum Marks:** 30 | **Mode:** Individual Assessment

---

## Scenario: University Course Enrollment Analysis
A university maintains course information in XML format. The Academic Office analyzes course enrollment, credit distribution, and course type for semester workload reporting.

---

## Question 1: Interpret the XML Structure (5 Marks)

| Question Sub-part | Solution & Explanation | Marks |
| :--- | :--- | :---: |
| **a. Root Element** | `<courses>` is the root element. It encloses all individual `<course>` elements in the XML document. | 1 |
| **b. Repeating Record Element** | `<course>` is the repeating record element representing each course entry. | 1 |
| **c. Unique Identifier Attribute** | `id` attribute (e.g., `id="C101"`, `id="C102"`) inside the `<course>` element uniquely identifies each course. | 1 |
| **d. Numeric Information Elements** | 1. `<students>` (e.g., `58`, `72`, `36`, `64`, `42`)<br/>2. `<credits>` (e.g., `4`, `4`, `2`, `4`, `3`) | 1 |
| **e. Well-Formedness & Justification** | **Yes, the XML document is structurally well-formed.**<br/>**Justification:**<br/>1. **Single Root Element:** It has exactly one root element (`<courses>`) enclosing all other elements.<br/>2. **Properly Nested & Closed Tags:** Every opening tag has a matching closing tag with no tag overlaps (e.g., `<code>...</code>`).<br/>3. **Quoted Attribute Values:** All attribute values are enclosed in quotes (e.g., `id="C101"`).<br/>4. **Valid XML Declaration:** Starts with a valid prologue `<?xml version="1.0" encoding="UTF-8"?>`.<br/>5. **Case-Sensitivity:** Tag names strictly match in casing. | 1 |

---

## Question 2: Apply XPath for Data Selection (10 Marks)

| S.No | Data Selection Requirement | XPath Expression | Matching Result / Nodes |
| :---: | :--- | :--- | :--- |
| **a.** | All course records | `/courses/course`<br/>*(or `//course`)* | All 5 `<course>` elements (C101, C102, C103, C104, C105) |
| **b.** | Names of all courses | `/courses/course/name`<br/>*(or `//course/name`)* | 1. Web Technology<br/>2. Artificial Intelligence<br/>3. Web Technology Laboratory<br/>4. Machine Learning<br/>5. Database Systems |
| **c.** | Courses having more than 50 students | `/courses/course[students > 50]` | 3 courses:<br/>• C101 (WEB301 - 58 students)<br/>• C102 (AI302 - 72 students)<br/>• C104 (ML304 - 64 students) |
| **d.** | Courses carrying 4 credits | `/courses/course[credits = 4]` | 3 courses:<br/>• C101 (WEB301 - 4 cr)<br/>• C102 (AI302 - 4 cr)<br/>• C104 (ML304 - 4 cr) |
| **e.** | Courses whose type is Theory | `/courses/course[type = 'Theory']` | 4 courses:<br/>• C101 (WEB301)<br/>• C102 (AI302)<br/>• C104 (ML304)<br/>• C105 (DB305) |
| **f.** | Names of Theory courses having more than 50 students | `/courses/course[type = 'Theory' and students > 50]/name` | 3 names:<br/>1. Web Technology<br/>2. Artificial Intelligence<br/>3. Machine Learning |
| **g.** | Faculty members handling courses with at least 4 credits | `/courses/course[credits >= 4]/faculty` | 3 faculty members:<br/>1. Dr. Arun (WEB301)<br/>2. Dr. Meena (AI302)<br/>3. Dr. Priya (ML304) |
| **h.** | The course whose id is C104 | `/courses/course[@id = 'C104']` | `<course id="C104">` (ML304 - Machine Learning) |
| **i.** | The first course available in the XML document | `/courses/course[1]`<br/>*(or `(//course)[1]`)* | `<course id="C101">` (WEB301 - Web Technology) |
| **j.** | The last course available in the XML document | `/courses/course[last()]`<br/>*(or `(//course)[last()]`)* | `<course id="C105">` (DB305 - Database Systems) |

---

## Question 3: Apply XSLT for Data Presentation (10 Marks)

### XSLT File: `transform.xsl`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />

    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>High Enrollment Courses</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { color: #1e3a8a; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
                    th { background-color: #1e40af; color: white; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                    .num { text-align: right; }
                </style>
            </head>
            <body>
                <h2>High Enrollment Courses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Faculty</th>
                            <th class="num">Students</th>
                            <th class="num">Credits</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- XPath Filter: Students > 40 -->
                        <!-- Sort: Descending order of student enrollment -->
                        <xsl:for-each select="courses/course[students &gt; 40]">
                            <xsl:sort select="students" data-type="number" order="descending" />
                            <tr>
                                <td><xsl:value-of select="code" /></td>
                                <td><xsl:value-of select="name" /></td>
                                <td><xsl:value-of select="faculty" /></td>
                                <td class="num"><xsl:value-of select="students" /></td>
                                <td class="num"><xsl:value-of select="credits" /></td>
                                <td><xsl:value-of select="type" /></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
```

### Resulting Transformed Table Output
| Course Code | Course Name | Faculty | Students | Credits | Type |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **AI302** | Artificial Intelligence | Dr. Meena | 72 | 4 | Theory |
| **ML304** | Machine Learning | Dr. Priya | 64 | 4 | Theory |
| **WEB301** | Web Technology | Dr. Arun | 58 | 4 | Theory |
| **DB305** | Database Systems | Dr. Kumar | 42 | 3 | Theory |

*(Note: `WEB303` with 36 students is excluded because `36 > 40` evaluates to false).*

---

## Question 4: Interpret the Extracted Data (5 Marks)

| Question Sub-part | Solution | Detailed Explanation / Evidence |
| :--- | :--- | :--- |
| **a. Highest Enrollment** | **Artificial Intelligence (`AI302` / `C102`)** | It has the highest student count of **72 students** (handled by Dr. Meena). |
| **b. Lowest Enrollment** | **Web Technology Laboratory (`WEB303` / `C103`)** | It has the lowest student count of **36 students** (handled by Dr. Ravi). |
| **c. Number of Theory courses** | **4 Theory Courses** | 4 out of 5 courses are Theory (`WEB301`, `AI302`, `ML304`, `DB305`). Only `WEB303` is Practical. |
| **d. Courses with exactly 4 credits** | **3 Courses:**<br/>1. `WEB301` (Web Technology)<br/>2. `AI302` (Artificial Intelligence)<br/>3. `ML304` (Machine Learning) | Evaluated with XPath `courses/course[credits = 4]`. `WEB303` has 2 credits and `DB305` has 3 credits. |
| **e. Courses requiring Teaching Assistant support (`students > 60`)** | **2 Courses:**<br/>1. **`AI302` - Artificial Intelligence** (72 students)<br/>2. **`ML304` - Machine Learning** (64 students) | Only AI302 (72) and ML304 (64) exceed the threshold of 60 students. WEB301 (58), DB305 (42), and WEB303 (36) do not qualify. |
