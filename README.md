HFX คือ web application สำหรับช่วยในการ tracking hotfix

# Hotfix Handling Flow

HFX เสนอ flow ในการจัดการ hotfix ดังนี้

## Flow: True Dev create a new hotfix without UAT

1. Developer A สร้าง hotfix ผ่าน Hotfix Creation Tool [http://ccbapts1:8888/](http://ccbapts1:8888/)
2. Hotfix จะถูกเก็บอยู่ที่ `@ccbapts1:/truuser12/inftools/aimsys/toolsamc/hotfix/HOTFIX/ABP/Release_${version}/HF_${HFID}`
3. Developer A เข้าไปที่ HFX web app [http://ccbapts1:8001](http://ccbapts1:8001) และเลือก tracking document ของ module และ version ที่ต้องการ (ดูเพิ่มเติมใน [Create New Tracking Document]())

{add image}

4. ที่ Tracking Document Screen, Developer A กดปุ่ม `Sync Hotfix` เพื่อให้ HFX โหลด hotfix ใหม่เข้ามาใน tracking document -- และกดปุ่ม `Save Document`

{add image}

5.  Developer A จะเห็น hotfix ของตนเองถูกเพิ่มเข้าไปใน hotfix list -- ถ้าหาไม่เจอให้กดที่ปุ่ม `Filter` และพิมพ์เลข hotfix id ลงใน filter bar เพื่อค้นหา hotfix

{add image}

6. ให้ Developer A นำ mouse ไปชี้ที่เลข hotfix id ของตน จะมีปุ่มเครื่องแสดงขึ้น ให้คลิกปุ่มรูปซองจดหมาย

{add image}

7. HFX จะเปิด mail client ที่มี mail content พร้อมสำหรับส่งเป็น mail hotfix delivery ให้ VM -- ให้ Developer A ตรวจสอบความถูกต้องของ mail content -- อาจเติมข้อมูลที่ขาดหายถ้าจำเป็น -- และกดปุ่ม `Send Mail` mail จะถูกส่งไปให้ `CCB-BDV-VM` -- แนะนำว่าก่อนส่งให้ใสเมลทีมตนเองลงไปในช่อง `Mail CC` ด้วย เพื่อจะได้เห็น mail

{add image}

8. Developer A นำ hotfix ไป deploy และเทสที่ Dev Env และจัดทำเอกสาร Test Result สำหรับเข้า CC Review (ให้ตั้งชื่อไฟล์เช่น `TEST_RESULT_HF{HFID}_{MODULE}_{VERSION}.docx`)

9. Developer A กลับไปที่ HFX Tracking Document Screen -- ค้นหา hotfix ของตน และคลิกปุ่มรูปเครื่องหมายบวกในคอลัมน์ `Ready`

10. จะมี `Confrim-Hotfix` popup form แสดงขึ้น ให้กรอกข้อมูลให้ครบและแนบไฟล์ test result ที่เตรียมไว้ และกดปุ่ม `Submit`

11. HFX จะตรวจสอบจาก list hotfix ที่ถูกสร้างก่อนหน้านั้นและยังไม่ได้ deploy on production ว่ามี hotfix ที่เป็น `dependency` ของ hotfix ที่กำลังจะ confirm หรือไม่ (เช่นมีไฟล์เชื่อเดียวกัน หรือมี class ที่รวมอยู่ใน jar ของ hotfix ที่กำลัง confirm -- สามารถแก้โปรแกรมเพิ่มเงื่อนไขของความเป็น dependency ได้ -- ดูเพิ่มเติมใน [Define Dependency Rules]()) -- ถ้าพบว่ามี dependency อย่างน้อย 1 ตัว HFX จะไม่ยอมให้ confirm hotfix นี้จนกว่า Developer A จะทำการ `resolve dependency` ให้เรียบร้อยก่อน ถ้า HFX ไม่บ่นอะไร แปลว่า hotfix ไม่มี dependency ใดๆ ให้ Developer A ข้ามไปทำขั้นตอน 12. ได้เลย -- ถ้า HFX ขอให้ resolve dependency -- ให้ Developer A ทำต่อไปนี้

    a. คลืกปุ่ม `Resolve Dependency` เพื่อเปลี่ยน `View` เข้าสู่ `Dependency View` ซึ่งจะมีคอลัมน์ `Dependency` และ `Depn` เพิ่มขึ้นมา

    b. ให้ Developer A คลิกที่คอลัมน์ `Depn` (ที่เป็นรูปดอกจัน) ใน row ของ hotfix ที่ต้องการ confirm

    c. ให้ Developer A มองหา hotfix อื่นๆ ที่มีค่าในคอลัมน์ `Dependency` เป็นดังภาพต่อไปนี้

    d. ภาพนี้นี้มีความหมายว่า HFXXXXX เป็น dependency ของ HFYYYYYY และ dependency นี้ยังไม่ได้รับการ resolve -- developer A จะต้องคลิกที่ปุ่มใดปุ่มหนึ่งใน 3 ปุ่มข้างเคียงเพื่อ resolve dependency -- แต่ละปุ่มมีความหมายดังนี้

		- ปุ่ม X หมายถึง HFXXXX ไม่ได้เป็น dependency ของ HFYYYYYY
        - ปุ่ม V หมายถึง HFXXXX เป็น dependency ของ HFYYYYYY จริง และทุกไฟล์ใน HFXXXXX จะถูก replaced โดยไฟล์ใน HFYYYYYY 
        - ปุ่ม + หมายถึง HFXXXX เป็น dependency ของ HFYYYYYY จริง แต่มีบางไฟล์ใน HFXXXXX ที่ไม่ถูก replaced โดย HFYYYYY -- ในกรณีนี้ HFXXXXX จะต้องถูก confirm พร้อมกับ HFYYYYYY (มิฉะนั้น change ใน HFXXXXX จะถูก implement บน production อย่างไม่สมบูรณ์และจะทำให้เกิดปัญหาได้)

   e. developer สามารถใช้ mouse ชี้ที่เลข HFID และเลือกปุ่มรูปดวงตาเพื่อดูรายละเอียดของ hotfix แต่ละตัวได้

12. เมื่อ confirm hotifx เรียบร้อยแล้ว ค่าในคอลัมน์ `Ready` จะเปลี่ยนเป็น date ของวันที่ปัจจุบัน -- อย่าลืมกดปุ่ม `Save Document`

13. Developer ทำซ้ำข้อ 1 - 12 เรื่อยๆ สำหรับ hotfix ใหม่ๆ ที่สร้างขึ้น

14. เมื่อถึงกำหนดที่จะต้อง confirm hotfix to production (VM จะส่งเมลแจ้ง) developer B จะเข้ามาที่ Tracking Document Screen และดูที่ Pie Chart -- หากพบว่ามีรายการ `Ready To Release` ให้กดที่ปุ่ม `Release To Production`

15. View จะถูกเปลี่ยนมาที่ `Release View` -- ซึ่ง hotfix list จะถูกแสดงเพียงแค่รายการที่ ready และรายการที่เป็น dependency ของรายการที่ ready 

16. Developer B review hotfix ตาม list นี้โดยภาพรวม -- และเลือก hotfix ที่ต้องการ confirm ขึ้น production โดยเลือก production date เป็นวันที่จะ deploy บน production -- หมายเหตุว่า HFX จะแสดง dependency ตามที่เก็บข้อมูลไว้แต่จะไม่มีการ validate ใดๆ ในส่วนนี้ -- developer สามารถที่จะเพิกเฉยต่อข้อมูล dependency ได้ด้วยวิจารณญาณ

17. Developer B คลิกที่ปุ่ม `Send Mail Confirm VM` จะมี Mail Client Popup แสดงขึ้นซึ่งมี ข้อมูลสำหรับแจ้ง VM -- hotfix ที่ไม่มีไฟล์จำเป็นต้อง deploy (เนื่องจากถูก replace ด้วย hotfix อื่น) จะถูกแยกไว้ในตารางเล็ก -- hotfix ที่มีบางไฟล์ถูก replace ด้วย hotfix อื่นจะอยู่ในตารางใหญ่ developer จะต้องกรอกข้อมูลว่ามีไฟล์ใดบ่้างที่จะให้ deploy และไฟล์ใดจะให้ ignore

18. ใน Form ด้านบน Mail Client จะมี รายการ Attachement เป็น Test Result ของแต่ละ hotfix -- ในกรณีที่มี hotfix ที่จำเป็นต้อง restart WLS -- developer จะต้องเตรียมเอกสาร IT SENIOR Review (เป็น power point) และเพิ่มลงในรายการ attachement 

19. เมื่อพร้อมแล้วให้กดปุม่ `Send Mail` 

20. จบ (อย่าลืม `Save Document`)