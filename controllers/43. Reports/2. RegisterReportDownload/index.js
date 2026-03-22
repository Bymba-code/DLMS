const prismaService = require("../../../services/prismaService");
const ExcelJS = require("exceljs");

const fmtNum  = (n) => new Intl.NumberFormat("mn-MN").format(n ?? 0);
const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return `${dt.getFullYear()}/${String(dt.getMonth()+1).padStart(2,"0")}/${String(dt.getDate()).padStart(2,"0")}`;
};

// ── Нүдний загвар ──
const s = (cell, opts = {}) => {
    const font = { name: "Arial", size: opts.size || 10 };
    if (opts.bold)  font.bold  = true;
    if (opts.color) font.color = { argb: opts.color };
    cell.font = font;
    if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
    if (opts.align) cell.alignment = { horizontal: opts.align, vertical: "middle", wrapText: opts.wrap || false };
    if (opts.border) {
        const bs = { style: "thin", color: { argb: "FFD0D0D0" } };
        cell.border = { top: bs, left: bs, bottom: bs, right: bs };
    }
    if (opts.numFmt) cell.numFmt = opts.numFmt;
};

const GET_REGISTER_REPORT_EXCEL = async (req, res) => {
    try {
        const user = req.user;
        const { year, month, branch, category, intake, active, completed, paymentStatus } = req.query;

        const courseId    = parseInt(user?.course);
        const now         = new Date();
        const targetYear  = year  ? parseInt(year)  : now.getFullYear();
        const targetMonth = month ? parseInt(month) : null;

        // ── 1. Огноо ──
        let dateFrom, dateTo;
        if (targetMonth) {
            dateFrom = new Date(targetYear, targetMonth - 1, 1);
            dateTo   = new Date(targetYear, targetMonth,     1);
        } else {
            dateFrom = new Date(targetYear,     0, 1);
            dateTo   = new Date(targetYear + 1, 0, 1);
        }

        // ── 2. WHERE ──
        const where = { course: courseId, date: { gte: dateFrom, lt: dateTo } };
        if (branch)   where.branch = parseInt(branch);
        if (intake)   where.intake = parseInt(intake);
        if (category) where.course_student_category = { some: { category: parseInt(category) } };
        if (active    !== undefined && active    !== "") where.active    = parseInt(active);
        if (completed !== undefined && completed !== "") where.completed = parseInt(completed);

        // ── 3. Татах ──
        const students = await prismaService.course_student.findMany({
            where,
            orderBy: { date: "asc" },
            include: {
                branches: { select: { id: true, name: true } },
                course_intake: {
                    select: {
                        id: true, name: true,
                        course_category_course_intake_course_categoryTocourse_category: {
                            select: {
                                category_course_category_categoryTocategory: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
                gender_course_student_genderTogender: { select: { id: true, gender: true } },
                course_student_category: {
                    select: {
                        id: true, payment: true, category: true,
                        category_course_student_category_categoryTocategory: { select: { id: true, name: true } },
                        course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: {
                            select: { id: true, status: true, amount: true, created_at: true, number: true },
                        },
                    },
                },
            },
        });

        // ── 4. Format ──
        let rows = students.map((st, i) => {
            const intakeName     = st.course_intake?.name ?? "—";
            const intakeCatName  =
                st.course_intake
                    ?.course_category_course_intake_course_categoryTocourse_category
                    ?.category_course_category_categoryTocategory?.name ?? "—";
            const catName =
                st.course_student_category?.[0]
                    ?.category_course_student_category_categoryTocategory?.name ?? "—";

            let expectedTotal = 0, paidAmount = 0;
            let totalInvoices = 0, paidInvoices = 0;
            let lastPaidDate  = null;

            for (const cat of st.course_student_category || []) {
                expectedTotal += parseFloat(cat.payment || 0);
                const pmts = cat.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];
                for (const p of pmts) {
                    totalInvoices++;
                    if (p.status === "paid") {
                        paidAmount += parseFloat(p.amount || 0);
                        paidInvoices++;
                        const d = p.created_at ? new Date(p.created_at) : null;
                        if (d && (!lastPaidDate || d > lastPaidDate)) lastPaidDate = d;
                    }
                }
            }
            const remainingAmount = Math.max(0, expectedTotal - paidAmount);
            const paymentPct      = expectedTotal > 0 ? Math.round((paidAmount / expectedTotal) * 100) : 0;
            const fullyPaid       = expectedTotal > 0 && remainingAmount === 0;

            return {
                no: i + 1,
                kode:          st.kode       || "—",
                familyname:    st.familyname || "—",
                firstname:     st.firstname  || "—",
                lastname:      st.lastname   || "—",
                register:      st.register   || "—",
                phone:         st.phone      || "—",
                gender:        st.gender_course_student_genderTogender?.gender || "—",
                branchName:    st.branches?.name ?? "—",
                intakeName,
                intakeCatName,
                catName,
                expectedTotal,
                paidAmount,
                remainingAmount,
                paymentPct,
                fullyPaid,
                totalInvoices,
                paidInvoices,
                lastPaidDate:  lastPaidDate ? fmtDate(lastPaidDate) : "—",
                active:        st.active    === 1 ? "Идэвхтэй"       : "Идэвхгүй",
                completed:     st.completed === 1 ? "Төгссөн"         : "Суралцаж байна",
                reason:        st.reason    || "—",
                date:          fmtDate(st.date),
            };
        });

        // paymentStatus шүүлт
        if (paymentStatus) {
            rows = rows.filter(r => {
                if (paymentStatus === "paid")    return r.fullyPaid;
                if (paymentStatus === "partial") return r.paidAmount > 0 && !r.fullyPaid;
                if (paymentStatus === "unpaid")  return r.paidAmount === 0 && r.expectedTotal > 0;
                return true;
            });
        }

        // ── 5. Нэгтгэл ──
        const total          = rows.length;
        const activeCount    = rows.filter(r => r.active     === "Идэвхтэй").length;
        const inactiveCount  = rows.filter(r => r.active     === "Идэвхгүй").length;
        const completedCount = rows.filter(r => r.completed  === "Төгссөн").length;
        const withReason     = rows.filter(r => r.reason     !== "—").length;
        const fullyPaidCount = rows.filter(r => r.fullyPaid).length;
        const partialCount   = rows.filter(r => r.paidAmount > 0 && !r.fullyPaid).length;
        const unpaidCount    = rows.filter(r => r.paidAmount === 0 && r.expectedTotal > 0).length;
        const grandExpected  = rows.reduce((a, r) => a + r.expectedTotal,   0);
        const grandPaid      = rows.reduce((a, r) => a + r.paidAmount,      0);
        const grandRemaining = rows.reduce((a, r) => a + r.remainingAmount, 0);
        const payPct         = grandExpected > 0 ? Math.round((grandPaid / grandExpected) * 100) : 0;

        const periodLabel = targetMonth
            ? `${targetYear} он · ${targetMonth}-р сар`
            : `${targetYear} он · Бүх сар`;

        // ── 6. ExcelJS ──
        const wb = new ExcelJS.Workbook();
        wb.creator = "DriveSchool System";
        wb.created = new Date();

        // ════ SHEET 1: Дэлгэрэнгүй жагсаалт ════
        const ws1 = wb.addWorksheet("Дэлгэрэнгүй жагсаалт");

        // Гарчиг
        ws1.mergeCells("A1:U1");
        s(ws1.getCell("A1"), { bold:true, size:13, fill:"FF0F172A", color:"FFFFFFFF", align:"center" });
        ws1.getCell("A1").value = `СУРАЛЦАГЧИЙН БҮРТГЭЛИЙН ТАЙЛАН — ${periodLabel}`;
        ws1.getRow(1).height = 32;

        // Нэгтгэл дэд мөр
        ws1.mergeCells("A2:U2");
        s(ws1.getCell("A2"), { size:9, fill:"FFF8FAFC", color:"FF475569", align:"center" });
        ws1.getCell("A2").value =
            `Нийт: ${total}  |  Идэвхтэй: ${activeCount}  |  Идэвхгүй: ${inactiveCount}  |  Төгссөн: ${completedCount}  ` +
            `|  Бүрэн төлсөн: ${fullyPaidCount}  |  Хэсэгчлэн: ${partialCount}  |  Төлөөгүй: ${unpaidCount}  ` +
            `|  Авах ёстой: ${fmtNum(grandExpected)}₮  |  Төлсөн: ${fmtNum(grandPaid)}₮  |  Үлдэгдэл: ${fmtNum(grandRemaining)}₮  (${payPct}%)`;
        ws1.getRow(2).height = 18;

        // Толгой
        const H = [
            { label:"№",               key:"no",            w:5,  align:"center" },
            { label:"Код",             key:"kode",          w:14, align:"left"   },
            { label:"Ургийн овог",     key:"familyname",    w:14, align:"left"   },
            { label:"Овог",            key:"firstname",     w:13, align:"left"   },
            { label:"Нэр",             key:"lastname",      w:13, align:"left"   },
            { label:"Регистр",         key:"register",      w:13, align:"left"   },
            { label:"Утас",            key:"phone",         w:12, align:"left"   },
            { label:"Хүйс",            key:"gender",        w:8,  align:"center" },
            { label:"Салбар",          key:"branchName",    w:16, align:"left"   },
            { label:"Элсэлт",          key:"intakeName",    w:22, align:"left"   },
            { label:"Элсэлт ангилал",  key:"intakeCatName", w:16, align:"left"   },
            { label:"Ангилал",         key:"catName",       w:14, align:"left"   },
            { label:"Авах ёстой₮",    key:"expectedTotal", w:15, align:"right", numFmt:"#,##0" },
            { label:"Төлсөн₮",        key:"paidAmount",    w:14, align:"right", numFmt:"#,##0" },
            { label:"Үлдэгдэл₮",      key:"remainingAmount",w:14,align:"right", numFmt:"#,##0" },
            { label:"Төлбөр %",        key:"paymentPct",    w:10, align:"center", numFmt:'0"%"' },
            { label:"Бүрэн төлсөн",   key:"fullyPaidStr",  w:12, align:"center" },
            { label:"Сүүлийн төлөлт", key:"lastPaidDate",  w:14, align:"center" },
            { label:"Идэвхтэй",       key:"active",        w:12, align:"center" },
            { label:"Төгссөн",        key:"completed",     w:14, align:"center" },
            { label:"Бүртгэсэн",      key:"date",          w:13, align:"center" },
        ];

        const hRow = ws1.getRow(3);
        H.forEach((h, ci) => {
            const cell = hRow.getCell(ci + 1);
            cell.value = h.label;
            s(cell, { bold:true, size:10, fill:"FFD4AF37", color:"FF0F172A", align:"center", border:true });
            ws1.getColumn(ci + 1).width = h.w;
        });
        hRow.height = 22;

        // Өгөгдлийн мөр
        const MN = ["1-р","2-р","3-р","4-р","5-р","6-р","7-р","8-р","9-р","10-р","11-р","12-р"];
        let lastMon = null, rowNum = 4;

        rows.forEach(row => {
            // Сар тусгаарлагч (жилийн тайланд)
            if (!targetMonth && students.length > 0) {
                const st = students.find((_, i) => i === row.no - 1);
                if (st?.date) {
                    const m = new Date(st.date).getMonth() + 1;
                    if (m !== lastMon) {
                        ws1.mergeCells(`A${rowNum}:U${rowNum}`);
                        const sc = ws1.getCell(`A${rowNum}`);
                        sc.value = `── ${MN[m-1]} сар ──`;
                        s(sc, { bold:true, size:10, fill:"FFF1F5F9", color:"FF64748B", align:"left" });
                        ws1.getRow(rowNum).height = 17;
                        lastMon = m;
                        rowNum++;
                    }
                }
            }

            const exRow = ws1.getRow(rowNum);
            const bg = rowNum % 2 === 0 ? "FFFAFAFA" : "FFFFFFFF";

            H.forEach((h, ci) => {
                const cell = exRow.getCell(ci + 1);
                let val    = row[h.key];

                // Тусгай нүдүүд
                if (h.key === "fullyPaidStr") val = row.fullyPaid ? "✓ Бүрэн" : "—";

                if (typeof val === "number") {
                    cell.value  = val;
                    cell.numFmt = h.numFmt || "0";
                } else {
                    cell.value = val;
                }

                // Өнгийн тэмдэглэгээ
                let color = "FF1E293B";
                if (h.key === "active")    color = val === "Идэвхтэй" ? "FF166534" : "FF991B1B";
                if (h.key === "completed" && val === "Төгссөн") color = "FF5B21B6";
                if (h.key === "fullyPaidStr") color = row.fullyPaid ? "FF166534" : "FF94A3B8";
                if (h.key === "paymentPct") {
                    color = row.paymentPct >= 100 ? "FF166534" : row.paymentPct >= 50 ? "FF92400E" : "FF991B1B";
                }
                if (h.key === "remainingAmount" && row.remainingAmount > 0) color = "FF991B1B";
                if (h.key === "paidAmount"      && row.paidAmount > 0)      color = "FF166534";

                s(cell, { fill: bg, color, align: h.align, border: true, size: 10 });
            });

            exRow.height = 18;
            rowNum++;
        });

        // Нийт мөр
        ws1.mergeCells(`A${rowNum}:L${rowNum}`);
        s(ws1.getCell(`A${rowNum}`),  { bold:true, fill:"FF0F172A", color:"FFFFFFFF", align:"right",  border:true, size:10 });
        ws1.getCell(`A${rowNum}`).value = `НИЙТ: ${total} суралцагч`;
        [
            { ci:13, v:grandExpected,  fill:"FFD4AF37", color:"FF0F172A" },
            { ci:14, v:grandPaid,      fill:"FF166534", color:"FFFFFFFF" },
            { ci:15, v:grandRemaining, fill:"FF991B1B", color:"FFFFFFFF" },
        ].forEach(({ ci, v, fill, color }) => {
            const c = ws1.getRow(rowNum).getCell(ci);
            c.value  = v;
            c.numFmt = "#,##0";
            s(c, { bold:true, fill, color, align:"right", border:true, size:10 });
        });
        ws1.getRow(rowNum).height = 22;

        // ════ SHEET 2: Нэгтгэл ════
        const ws2 = wb.addWorksheet("Нэгтгэл");
        [22,12,12,12,12,15,15,15,10].forEach((w, i) => ws2.getColumn(i+1).width = w);

        let sr = 1;

        const title2 = (text) => {
            ws2.mergeCells(`A${sr}:I${sr}`);
            ws2.getCell(`A${sr}`).value = text;
            s(ws2.getCell(`A${sr}`), { bold:true, size:11, fill:"FF0F172A", color:"FFFFFFFF", align:"left" });
            ws2.getRow(sr).height = 24;
            sr++;
        };

        const head2 = (cols) => {
            const r = ws2.getRow(sr);
            cols.forEach((c, i) => {
                r.getCell(i+1).value = c;
                s(r.getCell(i+1), { bold:true, size:10, fill:"FFD4AF37", color:"FF0F172A", align:"center", border:true });
            });
            r.height = 20;
            sr++;
        };

        const data2 = (vals, isTotal = false) => {
            const r = ws2.getRow(sr);
            vals.forEach((v, i) => {
                const c = r.getCell(i+1);
                if (typeof v === "number") { c.value = v; c.numFmt = i === 0 ? "0" : "#,##0"; }
                else c.value = v;
                s(c, {
                    bold: isTotal, border: true, size: 10,
                    fill: isTotal ? "FFF1F5F9" : (sr%2===0 ? "FFFAFAFA" : "FFFFFFFF"),
                    color: "FF1E293B", align: i === 0 ? "left" : "center",
                });
            });
            r.height = 18;
            sr++;
        };

        // Нийт нэгтгэл
        title2(`НИЙТ НЭГТГЭЛ — ${periodLabel}`);
        head2(["Үзүүлэлт", "Тоо", "Хувь"]);
        [
            ["Нийт бүртгэл",       total,         "100%"],
            ["Идэвхтэй",           activeCount,    `${Math.round(activeCount    /Math.max(total,1)*100)}%`],
            ["Идэвхгүй",           inactiveCount,  `${Math.round(inactiveCount  /Math.max(total,1)*100)}%`],
            ["Төгссөн",            completedCount, `${Math.round(completedCount /Math.max(total,1)*100)}%`],
            ["Шалтгаантай",        withReason,     `${Math.round(withReason     /Math.max(total,1)*100)}%`],
        ].forEach(r => data2(r));
        sr++;

        // Төлбөрийн нэгтгэл
        title2("ТӨЛБӨРИЙН НЭГТГЭЛ");
        head2(["Үзүүлэлт", "Тоо / Дүн", "Хувь"]);
        [
            ["Бүрэн төлсөн суралцагч",    fullyPaidCount, `${Math.round(fullyPaidCount/Math.max(total,1)*100)}%`],
            ["Хэсэгчлэн төлсөн",          partialCount,   `${Math.round(partialCount  /Math.max(total,1)*100)}%`],
            ["Төлбөр төлөөгүй",           unpaidCount,    `${Math.round(unpaidCount   /Math.max(total,1)*100)}%`],
            ["Авах ёстой нийт",           grandExpected,  "—"],
            ["Нийт төлсөн",               grandPaid,      `${payPct}%`],
            ["Нийт үлдэгдэл",             grandRemaining, "—"],
        ].forEach(r => data2(r));
        sr++;

        // Салбараар
        const byBranch = {};
        rows.forEach(r => {
            const k = r.branchName;
            if (!byBranch[k]) byBranch[k] = { total:0,active:0,inactive:0,completed:0,expected:0,paid:0,remaining:0,fullyPaid:0 };
            byBranch[k].total++;
            if (r.active==="Идэвхтэй")  byBranch[k].active++;
            if (r.active==="Идэвхгүй")  byBranch[k].inactive++;
            if (r.completed==="Төгссөн") byBranch[k].completed++;
            byBranch[k].expected  += r.expectedTotal;
            byBranch[k].paid      += r.paidAmount;
            byBranch[k].remaining += r.remainingAmount;
            byBranch[k].fullyPaid += r.fullyPaid ? 1 : 0;
        });
        title2("САЛБАРААР");
        head2(["Салбар","Нийт","Идэвхтэй","Идэвхгүй","Төгссөн","Авах ёстой₮","Төлсөн₮","Үлдэгдэл₮","Бүрэн"]);
        Object.entries(byBranch).sort((a,b)=>b[1].total-a[1].total).forEach(([k,v]) =>
            data2([k,v.total,v.active,v.inactive,v.completed,v.expected,v.paid,v.remaining,v.fullyPaid])
        );
        data2(["Нийт дүн",total,activeCount,inactiveCount,completedCount,grandExpected,grandPaid,grandRemaining,fullyPaidCount], true);
        sr++;

        // Ангилалаар
        const byCat = {};
        rows.forEach(r => {
            const k = r.intakeCatName !== "—" ? r.intakeCatName : r.catName;
            if (!byCat[k]) byCat[k] = { total:0,active:0,inactive:0,completed:0,expected:0,paid:0,remaining:0,fullyPaid:0 };
            byCat[k].total++;
            if (r.active==="Идэвхтэй")  byCat[k].active++;
            if (r.active==="Идэвхгүй")  byCat[k].inactive++;
            if (r.completed==="Төгссөн") byCat[k].completed++;
            byCat[k].expected  += r.expectedTotal;
            byCat[k].paid      += r.paidAmount;
            byCat[k].remaining += r.remainingAmount;
            byCat[k].fullyPaid += r.fullyPaid ? 1 : 0;
        });
        title2("АНГИЛАЛААР");
        head2(["Ангилал","Нийт","Идэвхтэй","Идэвхгүй","Төгссөн","Авах ёстой₮","Төлсөн₮","Үлдэгдэл₮","Бүрэн"]);
        Object.entries(byCat).sort((a,b)=>b[1].total-a[1].total).forEach(([k,v]) =>
            data2([k,v.total,v.active,v.inactive,v.completed,v.expected,v.paid,v.remaining,v.fullyPaid])
        );
        data2(["Нийт дүн",total,activeCount,inactiveCount,completedCount,grandExpected,grandPaid,grandRemaining,fullyPaidCount], true);
        sr++;

        // Элсэлтээр
        const byIntake = {};
        rows.forEach(r => {
            const k = r.intakeName;
            if (!byIntake[k]) byIntake[k] = { total:0,active:0,inactive:0,completed:0,expected:0,paid:0,remaining:0,fullyPaid:0 };
            byIntake[k].total++;
            if (r.active==="Идэвхтэй")  byIntake[k].active++;
            if (r.active==="Идэвхгүй")  byIntake[k].inactive++;
            if (r.completed==="Төгссөн") byIntake[k].completed++;
            byIntake[k].expected  += r.expectedTotal;
            byIntake[k].paid      += r.paidAmount;
            byIntake[k].remaining += r.remainingAmount;
            byIntake[k].fullyPaid += r.fullyPaid ? 1 : 0;
        });
        title2("ЭЛСЭЛТЭЭР");
        head2(["Элсэлт","Нийт","Идэвхтэй","Идэвхгүй","Төгссөн","Авах ёстой₮","Төлсөн₮","Үлдэгдэл₮","Бүрэн"]);
        Object.entries(byIntake).sort((a,b)=>b[1].total-a[1].total).forEach(([k,v]) =>
            data2([k,v.total,v.active,v.inactive,v.completed,v.expected,v.paid,v.remaining,v.fullyPaid])
        );
        data2(["Нийт дүн",total,activeCount,inactiveCount,completedCount,grandExpected,grandPaid,grandRemaining,fullyPaidCount], true);

        // ── 7. Response ──
        const safeMonth = targetMonth ? `-${targetMonth}р-сар` : "-бүх-сар";
        const filename  = `бүртгэлийн-тайлан-${targetYear}${safeMonth}.xlsx`;
        res.setHeader("Content-Type",        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
        await wb.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("EXCEL error:", err);
        return res.status(500).json({ success:false, data:[], message:"Тайлан үүсгэхэд алдаа гарлаа. " + err });
    }
};

module.exports = GET_REGISTER_REPORT_EXCEL;