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
    for (const attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        el.setAttribute(attribute, attributes[attribute]);
      }
    }
  }

  if (styles) {
    for (const style in styles) {
      if (styles.hasOwnProperty(style)) {
        el.style[style] = styles[style];
      }
    }
  }

  return el;
}

function parseFirestoreDocument(fields) {
  const data = {};

  for (const field in fields) {
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
            ' margin-t4__373c0__1C5Vu padding-t4__373c0__QdK4M border--top__373c0__1YJkA border-color--default__373c0__r305k',
          'aria-label': 'Health Inspections',
        });

        const headerContainer = domElement('div', {
          class:
            ' arrange__373c0__2iVWK gutter-auto__373c0__18b6A vertical-align-middle__373c0__2sr2a margin-b3__373c0__3wkWG border-color--default__373c0__r305k',
        });
        const headerContainee = domElement('div', {
          class:
            ' arrange-unit__373c0__3XPkE arrange-unit-fill__373c0__38Zde border-color--default__373c0__r305k',
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
            class: ' border-color--default__373c0__r305k',
          });
          const ul = domElement('ul', {
            class: ' undefined list__373c0__2Ud7X',
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
                ' margin-b5__373c0__2ZFFk border-color--default__373c0__r305k',
            });

            const liInspectionContainer = domElement('div', {
              class:
                ' margin-t2__373c0__A2LU2 margin-b2__373c0__117pB border-color--default__373c0__r305k',
            });
            const liInspectionContainee = domElement('div', {
              class:
                ' arrange__373c0__2iVWK gutter-2__373c0__1a5Xm vertical-align-baseline__373c0__1xCJv border-color--default__373c0__r305k',
            });

            const pDateContainer = domElement('div', {
              class:
                ' arrange-unit__373c0__3XPkE border-color--default__373c0__r305k',
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
                ' arrange-unit__373c0__3XPkE arrange-unit-fill__373c0__38Zde border-color--default__373c0__r305k',
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
                ' margin-t2__373c0__A2LU2 margin-b2__373c0__117pB border-color--default__373c0__r305k',
            });
            const liViolationsContainee = domElement('div', {
              class:
                ' arrange__373c0__2iVWK gutter-2__373c0__1a5Xm vertical-align-baseline__373c0__1xCJv border-color--default__373c0__r305k',
            });

            const pTitleContainer = domElement('div', {
              class:
                ' arrange-unit__373c0__3XPkE border-color--default__373c0__r305k',
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
                ' arrange__373c0__2iVWK gutter-2__373c0__1a5Xm vertical-align-baseline__373c0__1xCJv border-color--default__373c0__r305k',
            });
            const pViolationsContainee = domElement('div', {
              class:
                ' arrange-unit__373c0__3XPkE arrange-unit-fill__373c0__38Zde border-color--default__373c0__r305k',
            });

            const violations = inspections[i].violations;

            if (violations.length) {
              for (let j = 0; j < violations.length; j++) {
                const pViolation = domElement(
                  'p',
                  {
                    class:
                      ' margin-b1-5__373c0__3rO59 border-color--default__373c0__r305k answerText__373c0__1eMCO css-gdi06s',
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
                    ' margin-b1-5__373c0__3rO59 border-color--default__373c0__r305k answerText__373c0__1eMCO css-gdi06s',
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
            class: ' border-color--default__373c0__r305k',
          });
          const pNoInspectionsContainee = domElement('div', {
            class:
              ' margin-b1-5__373c0__3rO59 border-color--default__373c0__r305k',
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
          ' arrange-unit__373c0__3XPkE arrange-unit-grid-column--8__373c0__37EMu padding-r2__373c0__1jCaH border-color--default__373c0__r305k'
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
