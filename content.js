/* eslint-disable complexity */
/* eslint-disable max-statements */

// Initializations
function restaurantId() {
  const potentialIdElements = document.getElementsByClassName(' css-1h1j0y3');

  for (let i = potentialIdElements.length - 1; i >= 0; i--) {
    const el = potentialIdElements[i];
    const innerText = el.innerText;
    const matches = innerText.match(
      /^(\()[2-9]{1}\d{2}(\))(\s)[2-9]{1}\d{2}(-)\d{4}$/g
    );

    if (matches) {
      return innerText.replace(/\D+/g, '');
    }
  }

  return '';
}

function restaurantEndpoint(id) {
  return (
    'https://firestore.googleapis.com/v1/projects/yhel-per/databases/(default)/documents/restaurants/' +
    id
  );
}

function domElement(
  elementName,
  attributes = null,
  innerText = null,
  styles = null
) {
  const el = document.createElement(elementName);

  if (innerText) {
    el.innerText = innerText;
  }

  if (attributes) {
    for (let attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        el.setAttribute(attribute, attributes[attribute]);
      }
    }
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

        const section = domElement('section', {
          class:
            ' margin-t4__373c0__1TRkQ padding-t4__373c0__3hVZ3 border--top__373c0__19Owr border-color--default__373c0__2oFDT',
          'aria-label': 'Health Inspections',
        });

        const headerContainer = domElement('div', {
          class:
            ' arrange__373c0__UHqhV gutter-auto__373c0__K8mVn vertical-align-middle__373c0__2TQsQ margin-b3__373c0__q1DuY border-color--default__373c0__2oFDT',
        });
        const headerContainee = domElement('div', {
          class:
            ' arrange-unit__373c0__1piwO arrange-unit-fill__373c0__17z0h border-color--default__373c0__2oFDT',
        });
        const header = domElement(
          'h4',
          {
            class: 'css-16iwlls',
          },
          'Health Inspections'
        );

        headerContainee.appendChild(header);
        headerContainer.appendChild(headerContainee);
        section.appendChild(headerContainer);

        if (inspections && inspections.length) {
          const ulContainer = domElement('div', {
            class: ' border-color--default__373c0__2oFDT',
          });
          const ul = domElement('ul', {
            class: ' undefined list__373c0__3GI_T',
          });

          for (let i = 0; i < inspections.length; i++) {
            const grade = inspections[i].grade || 'N/A';
            const score = inspections[i].score || 'N/A';
            let date = inspections[i].date + ':';

            if (date.length === 10) {
              date += '  ';
            } else if (date.length === 9) {
              date += '    ';
            }

            const li = domElement('li', {
              class:
                ' margin-b5__373c0__2ErL8 border-color--default__373c0__2oFDT',
            });

            const liInspectionContainer = domElement('div', {
              class:
                ' margin-t2__373c0__1CFWK margin-b2__373c0__abANL border-color--default__373c0__2oFDT',
            });
            const liInspectionContainee = domElement('div', {
              class:
                ' arrange__373c0__UHqhV gutter-2__373c0__3Zpeq vertical-align-baseline__373c0__2s3Ze border-color--default__373c0__2oFDT',
            });

            const pDateContainer = domElement('div', {
              class:
                ' arrange-unit__373c0__1piwO border-color--default__373c0__2oFDT',
            });
            const pDate = domElement(
              'p',
              {
                class: ' css-m6anxm',
              },
              date,
              { whiteSpace: 'pre' }
            );

            const pGradeAndScoreContainer = domElement('div', {
              class:
                ' arrange-unit__373c0__1piwO arrange-unit-fill__373c0__17z0h border-color--default__373c0__2oFDT',
            });
            const pGradeAndScore = domElement(
              'p',
              {
                class: ' css-hr52z0',
              },
              'Grade - ' + grade + ' | Score - ' + score
            );

            const liViolationsContainer = domElement('div', {
              class:
                ' margin-t2__373c0__1CFWK margin-b2__373c0__abANL border-color--default__373c0__2oFDT',
            });
            const liViolationsContainee = domElement('div', {
              class:
                ' arrange__373c0__UHqhV gutter-2__373c0__3Zpeq vertical-align-baseline__373c0__2s3Ze border-color--default__373c0__2oFDT',
            });

            const pTitleContainer = domElement('div', {
              class:
                ' arrange-unit__373c0__1piwO border-color--default__373c0__2oFDT',
            });
            const pTitle = domElement(
              'p',
              {
                class: ' css-m6anxm',
              },
              'Violations:  ',
              { whiteSpace: 'pre' }
            );

            const pViolationsContainer = domElement('div', {
              class:
                ' arrange__373c0__UHqhV gutter-2__373c0__3Zpeq vertical-align-baseline__373c0__2s3Ze border-color--default__373c0__2oFDT',
            });
            const pViolationsContainee = domElement('div', {
              class:
                ' arrange-unit__373c0__1piwO arrange-unit-fill__373c0__17z0h border-color--default__373c0__2oFDT',
            });

            const violations = inspections[i].violations;

            if (violations.length) {
              for (let j = 0; j < violations.length; j++) {
                const pViolation = domElement(
                  'p',
                  {
                    class:
                      ' margin-t2__373c0__1CFWK answerText__373c0__3nO_4 css-gdi06s',
                  },
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
                {
                  class:
                    ' margin-t2__373c0__1CFWK answerText__373c0__3nO_4 css-gdi06s',
                },
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
          const pNoInspectionsContainer = domElement('div', {
            class:
              ' margin-b2__373c0__abANL border-color--default__373c0__3-ifU',
          });
          const pNoInspectionsContainee = domElement('div', {
            class:
              ' margin-b1__373c0__1khoT border-color--default__373c0__3-ifU',
          });
          const pNoInspections = domElement(
            'p',
            {
              class: ' css-gdi06s',
            },
            'No DOH NYC restaurant inspection results data was found for this business.'
          );

          pNoInspectionsContainee.appendChild(pNoInspections);
          pNoInspectionsContainer.appendChild(pNoInspectionsContainee);
          section.appendChild(pNoInspectionsContainer);
        }

        const parent = document.getElementsByClassName(
          ' arrange-unit__373c0__1piwO arrange-unit-grid-column--8__373c0__2yTAx padding-r2__373c0__28zpp border-color--default__373c0__2oFDT'
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
