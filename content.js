/* eslint-disable complexity */
/* eslint-disable max-statements */

// Initializations
function restaurantId() {
  return document
    .getElementsByClassName(
      'icon--24-phone-v2 icon__373c0__3n-2P css-1mpk29p'
    )[0]
    .parentNode.parentNode.children[0].innerText.replace(/\D+/g, '');
}

function restaurantEndpoint(id) {
  return (
    'https://firestore.googleapis.com/v1/projects/yhel-per/databases/(default)/documents/restaurants/' +
    id
  );
}

function domElement(tagName, className, innerText = null, styles = null) {
  const el = document.createElement(tagName);
  el.className = className;

  if (innerText) {
    el.innerText = innerText;
  }

  if (styles) {
    for (let style in styles) {
      if (styles.hasOwnProperty(style)) {
        el.style[style] = styles[style];
      }
    }
  }

  return el;
}

function parseFirestoreDocument(fields) {
  const data = {};

  for (let field in fields) {
    if (fields.hasOwnProperty(field)) {
      const val = fields[field];

      if (field === 'arrayValue') {
        return (val.values || []).map(function(el) {
          return parseFirestoreDocument(el);
        });
      } else if (field === 'mapValue') {
        return parseFirestoreDocument(val.fields || {});
      } else if (field === 'geoPointValue') {
        return {
          latitude: val.latitude,
          longitude: val.longitude,
        };
      } else if (field === 'integerValue') {
        return parseInt(val, 10);
      } else if (
        field === 'stringValue' ||
        field === 'timestampValue' ||
        field === 'referenceValue' ||
        field === 'doubleValue' ||
        field === 'booleanValue' ||
        field === 'nullValue'
      ) {
        return val;
      } else {
        data[field] = parseFirestoreDocument(val);
      }
    }
  }

  return data;
}

// Execute when page is fully loaded
window.addEventListener('load', function() {
  const rid = restaurantId();
  const endpoint = restaurantEndpoint(rid);

  if (rid) {
    const req = new XMLHttpRequest();
    req.responseType = 'json';

    req.onload = function() {
      try {
        const restaurant = parseFirestoreDocument(req.response.fields);
        const inspections = restaurant.inspections || null;

        const section = domElement(
          'section',
          ' margin-t4__373c0__1TRkQ padding-t4__373c0__3hVZ3 border--top__373c0__3gXLy border-color--default__373c0__3-ifU'
        );

        const headerContainer = domElement(
          'div',
          ' arrange__373c0__2C9bH gutter-auto__373c0__1Ep_j vertical-align-middle__373c0__1SDTo margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU'
        );
        const headerContainee = domElement(
          'div',
          ' arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU'
        );
        const header = domElement(
          'h4',
          ' heading--h4__373c0__27bDo heading--inline__373c0__10ozy',
          'Health Inspections'
        );

        headerContainee.appendChild(header);
        headerContainer.appendChild(headerContainee);
        section.appendChild(headerContainer);

        if (inspections && inspections.length) {
          const ulContainer = domElement(
            'div',
            ' border-color--default__373c0__3-ifU'
          );
          const ul = domElement('ul', ' undefined list__373c0__3GI_T');

          for (let i = 0; i < inspections.length; i++) {
            const grade = inspections[i].grade || 'N/A';
            const score = inspections[i].score || 'N/A';
            let date = inspections[i].date + ':';

            if (date.length === 10) {
              date += '  ';
            } else if (date.length === 9) {
              date += '    ';
            }

            const li = domElement(
              'li',
              ' margin-b5__373c0__2ErL8 border-color--default__373c0__3-ifU'
            );

            const liInspectionContainer = domElement(
              'div',
              ' margin-t2__373c0__1CFWK margin-b2__373c0__abANL border-color--default__373c0__3-ifU'
            );
            const liInspectionContainee = domElement(
              'div',
              ' arrange__373c0__2C9bH gutter-2__373c0__1DiLQ vertical-align-baseline__373c0__3HGi9 border-color--default__373c0__3-ifU'
            );

            const pDateContainer = domElement(
              'div',
              ' arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU'
            );
            const pDate = domElement(
              'p',
              ' text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--bold__373c0__1elNz text-size--large__373c0__3t60B',
              date,
              { whiteSpace: 'pre' }
            );

            const pGradeAndScoreContainer = domElement(
              'div',
              ' arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU'
            );
            const pGradeAndScore = domElement(
              'p',
              ' text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B',
              'Grade - ' + grade + ' | Score - ' + score
            );

            const liViolationsContainer = domElement(
              'div',
              ' margin-t2__373c0__1CFWK margin-b2__373c0__abANL border-color--default__373c0__3-ifU'
            );
            const liViolationsContainee = domElement(
              'div',
              ' arrange__373c0__2C9bH gutter-2__373c0__1DiLQ vertical-align-baseline__373c0__3HGi9 border-color--default__373c0__3-ifU'
            );

            const pTitleContainer = domElement('div');
            pTitleContainer.className =
              ' arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU';
            const pTitle = domElement(
              'p',
              ' text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--bold__373c0__1elNz text-size--large__373c0__3t60B',
              'Violations:  ',
              { whiteSpace: 'pre' }
            );

            const pViolationsContainer = domElement(
              'div',
              ' arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU'
            );
            const pViolationsContainee = domElement(
              'div',
              ' text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-size--large__373c0__3t60B'
            );

            const violations = inspections[i].violations;

            if (violations.length) {
              for (let j = 0; j < violations.length; j++) {
                const pViolation = domElement(
                  'p',
                  ' margin-t2__373c0__1CFWK margin-b2__373c0__abANL border-color--default__373c0__3-ifU',
                  violations[j].description
                );

                if (violations[j].critical) {
                  pViolation.style.color = '#f40d15';
                }

                pViolationsContainee.appendChild(pViolation);
              }
            } else {
              const pViolation = domElement(
                'p',
                ' margin-t2__373c0__1CFWK margin-b2__373c0__abANL border-color--default__373c0__3-ifU',
                'N/A'
              );

              pViolationsContainee.appendChild(pViolation);
            }

            pDateContainer.appendChild(pDate);
            liInspectionContainee.appendChild(pDateContainer);

            pGradeAndScoreContainer.appendChild(pGradeAndScore);
            liInspectionContainee.appendChild(pGradeAndScoreContainer);

            pTitleContainer.appendChild(pTitle);
            liViolationsContainee.appendChild(pTitleContainer);

            pViolationsContainer.appendChild(pViolationsContainee);
            liViolationsContainee.appendChild(pViolationsContainer);

            liInspectionContainer.appendChild(liInspectionContainee);
            li.appendChild(liInspectionContainer);

            liViolationsContainer.appendChild(liViolationsContainee);
            li.appendChild(liViolationsContainer);

            ul.appendChild(li);
          }

          ulContainer.appendChild(ul);
          section.appendChild(ulContainer);
        } else {
          const pNoInspectionsContainer = domElement(
            'div',
            ' margin-b2__373c0__abANL border-color--default__373c0__3-ifU'
          );
          const pNoInspectionsContainee = domElement(
            'div',
            ' margin-b1__373c0__1khoT border-color--default__373c0__3-ifU'
          );
          const pNoInspections = domElement(
            'p',
            ' text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-size--large__373c0__3t60B',
            'No DOH NYC restaurant inspection results data was found for this business.'
          );

          pNoInspectionsContainee.appendChild(pNoInspections);
          pNoInspectionsContainer.appendChild(pNoInspectionsContainee);
          section.appendChild(pNoInspectionsContainer);
        }

        const parent = document.getElementsByClassName(
          ' arrange-unit__373c0__o3tjT arrange-unit-grid-column--8__373c0__2dUx_ padding-r2__373c0__28zpp border-color--default__373c0__3-ifU'
        )[0];
        parent.insertBefore(section, parent.children[1]);
      } catch (error) {
        console.error(error);
      }
    };

    req.onerror = function() {
      console.error('Error!');
    };

    req.open('GET', endpoint, true);

    req.send();
  }
});
