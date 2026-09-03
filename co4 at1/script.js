// XML String Data
const xmlDataString = `<?xml version="1.0" encoding="UTF-8"?>
<courses>
    <course id="C101">
        <code>WEB301</code>
        <name>Web Technology</name>
        <faculty>Dr. Arun</faculty>
        <students>58</students>
        <credits>4</credits>
        <type>Theory</type>
    </course>
    <course id="C102">
        <code>AI302</code>
        <name>Artificial Intelligence</name>
        <faculty>Dr. Meena</faculty>
        <students>72</students>
        <credits>4</credits>
        <type>Theory</type>
    </course>
    <course id="C103">
        <code>WEB303</code>
        <name>Web Technology Laboratory</name>
        <faculty>Dr. Ravi</faculty>
        <students>36</students>
        <credits>2</credits>
        <type>Practical</type>
    </course>
    <course id="C104">
        <code>ML304</code>
        <name>Machine Learning</name>
        <faculty>Dr. Priya</faculty>
        <students>64</students>
        <credits>4</credits>
        <type>Theory</type>
    </course>
    <course id="C105">
        <code>DB305</code>
        <name>Database Systems</name>
        <faculty>Dr. Kumar</faculty>
        <students>42</students>
        <credits>3</credits>
        <type>Theory</type>
    </course>
</courses>`;

const xsltDataString = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />

    <xsl:template match="/">
        <html>
            <head>
                <style>
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
                    th { background-color: #1e40af; color: white; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                    .num { text-align: right; }
                    .badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
                    .badge-theory { background: #dbeafe; color: #1e40af; }
                    .badge-practical { background: #dcfce7; color: #166534; }
                </style>
            </head>
            <body>
                <h3 style="color:#1e3a8a; margin-top:0;">High Enrollment Courses</h3>
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
                        <xsl:for-each select="courses/course[students &gt; 40]">
                            <xsl:sort select="students" data-type="number" order="descending" />
                            <tr>
                                <td><strong><xsl:value-of select="code" /></strong></td>
                                <td><xsl:value-of select="name" /></td>
                                <td><xsl:value-of select="faculty" /></td>
                                <td class="num"><xsl:value-of select="students" /></td>
                                <td class="num"><xsl:value-of select="credits" /></td>
                                <td>
                                    <span>
                                        <xsl:attribute name="class">
                                            <xsl:choose>
                                                <xsl:when test="type = 'Theory'">badge badge-theory</xsl:when>
                                                <xsl:otherwise>badge badge-practical</xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:attribute>
                                        <xsl:value-of select="type" />
                                    </span>
                                </td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;

// XPath questions list for Question 2
const xpathQuestions = [
    { part: "a", req: "All course records", xpath: "/courses/course" },
    { part: "b", req: "Names of all courses", xpath: "/courses/course/name" },
    { part: "c", req: "Courses having more than 50 students", xpath: "/courses/course[students > 50]" },
    { part: "d", req: "Courses carrying 4 credits", xpath: "/courses/course[credits = 4]" },
    { part: "e", req: "Courses whose type is Theory", xpath: "/courses/course[type = 'Theory']" },
    { part: "f", req: "Names of Theory courses having more than 50 students", xpath: "/courses/course[type = 'Theory' and students > 50]/name" },
    { part: "g", req: "Faculty members handling courses with at least 4 credits", xpath: "/courses/course[credits >= 4]/faculty" },
    { part: "h", req: "The course whose id is C104", xpath: "/courses/course[@id = 'C104']" },
    { part: "i", req: "The first course available in the XML document", xpath: "/courses/course[1]" },
    { part: "j", req: "The last course available in the XML document", xpath: "/courses/course[last()]" }
];

let xmlDoc = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Parse XML
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlDataString, "application/xml");

    // Display raw XML & XSLT
    const xmlDisplayEl = document.getElementById("xmlDisplay");
    if (xmlDisplayEl) {
        xmlDisplayEl.textContent = xmlDataString;
    }
    const xsltDisplayEl = document.getElementById("xsltDisplay");
    if (xsltDisplayEl) {
        xsltDisplayEl.textContent = xsltDataString;
    }

    // Populate XPath Table
    populateXPathTable();

    // Tab Navigation
    setupTabs();

    // XPath Execution Buttons
    setupXPathEngine();

    // Execute XSLT Transformation
    executeXSLT();
});

// Setup Navigation Tabs
function setupTabs() {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const targetId = `tab-${btn.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
}

// Populate Question 2 XPath Table
function populateXPathTable() {
    const tbody = document.getElementById("xpathQuestionsTable");
    if (!tbody) return;

    tbody.innerHTML = "";
    xpathQuestions.forEach(q => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${q.part}.</strong></td>
            <td>${q.req}</td>
            <td><code class="xpath-code">${escapeHtml(q.xpath)}</code></td>
            <td><button class="btn btn-primary btn-sm try-btn" data-xpath="${escapeHtml(q.xpath)}">Try</button></td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".try-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const xpath = btn.getAttribute("data-xpath");
            document.getElementById("xpathInput").value = xpath;
            evaluateXPath(xpath);
        });
    });
}

// Setup XPath Engine
function setupXPathEngine() {
    const runBtn = document.getElementById("runXPathBtn");
    const input = document.getElementById("xpathInput");

    if (runBtn && input) {
        runBtn.addEventListener("click", () => {
            evaluateXPath(input.value.trim());
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                evaluateXPath(input.value.trim());
            }
        });

        // Run default query
        evaluateXPath(input.value.trim());
    }
}

// Evaluate XPath on XML Document
function evaluateXPath(expression) {
    const resultsContainer = document.getElementById("xpathResultsContent");
    const badge = document.getElementById("matchCountBadge");
    if (!resultsContainer || !expression) return;

    resultsContainer.innerHTML = "";

    try {
        const result = xmlDoc.evaluate(expression, xmlDoc, null, XPathResult.ANY_TYPE, null);
        let matches = [];

        if (result.resultType === XPathResult.NUMBER_TYPE) {
            matches.push(`Number Result: ${result.numberValue}`);
        } else if (result.resultType === XPathResult.STRING_TYPE) {
            matches.push(`String Result: "${result.stringValue}"`);
        } else if (result.resultType === XPathResult.BOOLEAN_TYPE) {
            matches.push(`Boolean Result: ${result.booleanValue}`);
        } else {
            let node = result.iterateNext();
            while (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const serializer = new XMLSerializer();
                    matches.push(serializer.serializeToString(node));
                } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
                    matches.push(`@${node.nodeName} = "${node.nodeValue}"`);
                } else if (node.nodeType === Node.TEXT_NODE) {
                    matches.push(node.nodeValue);
                } else {
                    matches.push(node.textContent);
                }
                node = result.iterateNext();
            }
        }

        badge.textContent = `${matches.length} Match${matches.length === 1 ? '' : 'es'}`;
        
        if (matches.length === 0) {
            resultsContainer.innerHTML = `<span style="color: #94a3b8;">No matching nodes found for expression: <code>${escapeHtml(expression)}</code></span>`;
            return;
        }

        matches.forEach((m, idx) => {
            const card = document.createElement("div");
            card.className = "result-card";
            card.innerHTML = `<div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">Match #${idx + 1}</div><pre style="margin:0; white-space:pre-wrap; word-break:break-word;"><code>${escapeHtml(m)}</code></pre>`;
            resultsContainer.appendChild(card);
        });

    } catch (err) {
        badge.textContent = "Error";
        resultsContainer.innerHTML = `<span style="color: #ef4444;">XPath Evaluation Error: ${escapeHtml(err.message)}</span>`;
    }
}

// Execute Client-Side XSLT
function executeXSLT() {
    const container = document.getElementById("xsltOutputContainer");
    if (!container) return;

    try {
        if (window.XSLTProcessor) {
            const parser = new DOMParser();
            const xslDoc = parser.parseFromString(xsltDataString, "application/xml");
            
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslDoc);

            const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
            container.innerHTML = "";
            container.appendChild(resultDocument);
        } else {
            container.innerHTML = "<p style='color:#ef4444;'>XSLTProcessor is not supported by your browser.</p>";
        }
    } catch (err) {
        container.innerHTML = `<p style='color:#ef4444;'>Transformation Error: ${escapeHtml(err.message)}</p>`;
    }
}

// Utility
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
