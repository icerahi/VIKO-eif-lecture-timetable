export const getPayload = (datefrom, dateto, all = false, groupId = "-910") => {
  if (all) {
    return {
      __args: [
        null,
        2025,
        {
          vt_filter: {
            datefrom: datefrom,
            dateto: dateto,
          },
        },
        {
          op: "fetch",
          needed_part: {
            teachers: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
              "cb_hidden",
              "expired",
            ],
            classes: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
              "classroomid",
            ],
            classrooms: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
            ],
            igroups: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
            ],
            students: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
              "classid",
            ],
            subjects: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
            ],
            events: ["typ", "name"],
            event_types: ["name", "icon"],
            subst_absents: ["date", "absent_typeid", "groupname"],
            periods: [
              "short",
              "name",
              "firstname",
              "lastname",
              "callname",
              "subname",
              "code",
              "period",
              "starttime",
              "endtime",
            ],
            dayparts: ["starttime", "endtime"],
            dates: ["tt_num", "tt_day"],
          },
          needed_combos: {},
        },
      ],
      __gsh: "00000000",
    };
  } else {
    return {
      __args: [
        null,
        {
          year: 2025,
          datefrom: datefrom,
          dateto: dateto,
          table: "classes",
          id: groupId,
          showColors: true,
          showIgroupsInClasses: false,
          showOrig: true,
          log_module: "CurrentTTView",
        },
      ],
      __gsh: "00000000",
    };
  }
};
